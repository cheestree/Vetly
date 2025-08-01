package com.cheestree.vetly.service

import com.cheestree.vetly.config.AppConfig
import com.cheestree.vetly.domain.animal.Animal
import com.cheestree.vetly.domain.exception.VetException.InactiveResourceException
import com.cheestree.vetly.domain.exception.VetException.ResourceAlreadyExistsException
import com.cheestree.vetly.domain.exception.VetException.ResourceNotFoundException
import com.cheestree.vetly.domain.exception.VetException.ResourceType.ANIMAL
import com.cheestree.vetly.domain.exception.VetException.ResourceType.USER
import com.cheestree.vetly.domain.filter.Filter
import com.cheestree.vetly.domain.filter.Operation
import com.cheestree.vetly.domain.storage.StorageFolder
import com.cheestree.vetly.domain.user.AuthenticatedUser
import com.cheestree.vetly.domain.user.User
import com.cheestree.vetly.domain.user.roles.Role
import com.cheestree.vetly.http.model.input.animal.AnimalCreateInputModel
import com.cheestree.vetly.http.model.input.animal.AnimalQueryInputModel
import com.cheestree.vetly.http.model.input.animal.AnimalUpdateInputModel
import com.cheestree.vetly.http.model.output.ResponseList
import com.cheestree.vetly.http.model.output.animal.AnimalInformation
import com.cheestree.vetly.http.model.output.animal.AnimalPreview
import com.cheestree.vetly.repository.AnimalRepository
import com.cheestree.vetly.repository.UserRepository
import com.cheestree.vetly.service.Utils.Companion.combineAll
import com.cheestree.vetly.service.Utils.Companion.createResource
import com.cheestree.vetly.service.Utils.Companion.deleteResource
import com.cheestree.vetly.service.Utils.Companion.executeOperation
import com.cheestree.vetly.service.Utils.Companion.mappedFilters
import com.cheestree.vetly.service.Utils.Companion.retrieveResource
import com.cheestree.vetly.service.Utils.Companion.updateResource
import com.cheestree.vetly.service.Utils.Companion.withFilters
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.time.ZoneOffset

@Service
class AnimalService(
    private val animalRepository: AnimalRepository,
    private val userRepository: UserRepository,
    private val storageService: StorageService,
    private val appConfig: AppConfig,
) {
    fun getAllAnimals(
        user: AuthenticatedUser,
        query: AnimalQueryInputModel = AnimalQueryInputModel(),
    ): ResponseList<AnimalPreview> {
        val pageable: Pageable =
            PageRequest.of(
                query.page.coerceAtLeast(0),
                query.size.coerceAtMost(appConfig.paging.maxPageSize),
                Sort.by(query.sortDirection, query.sortBy),
            )

        val baseFilters =
            mappedFilters<Animal>(
                listOf(
                    Filter("name", query.name, Operation.LIKE),
                    Filter("microchip", query.microchip, Operation.EQUAL, caseInsensitive = false),
                    Filter("sex", query.sex?.name, Operation.LIKE),
                    Filter("sterilized", query.sterilized, Operation.EQUAL),
                    Filter("species", query.species, Operation.LIKE),
                    Filter(
                        "birthDate",
                        Pair(
                            query.birthDate?.atStartOfDay(ZoneOffset.UTC)?.toOffsetDateTime(),
                            query.birthDate
                                ?.plusDays(1)
                                ?.atStartOfDay(ZoneOffset.UTC)
                                ?.toOffsetDateTime(),
                        ),
                        Operation.BETWEEN,
                    ),
                ),
            )

        val extraFilters =
            withFilters<Animal>(
                { root, cb ->
                    query.owned?.let {
                        val owner = root.get<User>("owner")
                        if (it) cb.isNotNull(owner) else cb.isNull(owner)
                    }
                },
                { root, cb ->
                    query.self?.let {
                        val ownerId = root.get<User>("owner").get<Long>("id")
                        if (it) cb.equal(ownerId, user.id) else cb.notEqual(ownerId, user.id)
                    }
                },
                { root, cb ->
                    val ownerEmail = root.get<User>("owner").get<String>("email")
                    when {
                        !user.roles.contains(Role.ADMIN) && !user.roles.contains(Role.VETERINARIAN) -> {
                            cb.like(ownerEmail, "%${user.email}%")
                        }
                        (user.roles.contains(Role.ADMIN) || user.roles.contains(Role.VETERINARIAN)) && query.userEmail != null -> {
                            cb.like(ownerEmail, "%${query.userEmail}%")
                        }
                        else -> null
                    }
                },
                { root, cb ->
                    if (user.roles.contains(Role.ADMIN) || user.roles.contains(Role.VETERINARIAN)) {
                        query.active?.let { cb.equal(root.get<Boolean>("isActive"), it) }
                    } else {
                        null
                    }
                },
            )

        val allSpecs = combineAll(baseFilters, extraFilters)
        val pageResult = animalRepository.findAll(allSpecs, pageable).map { it.asPreview() }

        return ResponseList(
            elements = pageResult.content,
            page = pageResult.number,
            size = pageResult.size,
            totalElements = pageResult.totalElements,
            totalPages = pageResult.totalPages,
        )
    }

    fun getAnimal(animalId: Long): AnimalInformation =
        retrieveResource(ANIMAL, animalId) {
            val animal =
                animalRepository.findById(animalId).orElseThrow {
                    ResourceNotFoundException(ANIMAL, animalId)
                }

            if (!animal.isActive) {
                throw InactiveResourceException(ANIMAL, animalId)
            }

            animal.asPublic()
        }

    fun createAnimal(
        createdAnimal: AnimalCreateInputModel,
        image: MultipartFile?,
    ): Long =
        createResource(ANIMAL) {
            createdAnimal.microchip?.let {
                if (animalRepository.existsAnimalByMicrochip(createdAnimal.microchip)) {
                    throw ResourceAlreadyExistsException(ANIMAL, "microchip", createdAnimal.microchip)
                }
            }

            val owner =
                createdAnimal.ownerEmail?.let {
                    userRepository.findByEmail(it).orElseThrow {
                        ResourceNotFoundException(USER, it)
                    }
                }

            val imageUrl =
                image?.let {
                    storageService.uploadFile(
                        file = it,
                        folder = StorageFolder.ANIMALS,
                        identifier = "temp_${System.currentTimeMillis()}",
                        customFileName = "profile",
                    )
                }

            val animal =
                Animal(
                    name = createdAnimal.name,
                    microchip = createdAnimal.microchip,
                    sex = createdAnimal.sex,
                    sterilized = createdAnimal.sterilized,
                    birthDate = createdAnimal.birthDate,
                    species = createdAnimal.species,
                    image = imageUrl,
                    owner = owner,
                )

            owner?.let { animal.addOwner(it) }

            animalRepository.save(animal).id
        }

    fun updateAnimal(
        id: Long,
        updatedAnimal: AnimalUpdateInputModel,
    ): AnimalInformation =
        updateResource(ANIMAL, id) {
            val animal =
                animalRepository.findById(id).orElseThrow {
                    ResourceNotFoundException(ANIMAL, id)
                }

            if (!animal.isActive) {
                throw InactiveResourceException(ANIMAL, id)
            }

            updatedAnimal.microchip.ifPresent { microchip ->
                if (microchip != animal.microchip &&
                    microchip != null &&
                    animalRepository.existsAnimalByMicrochip(microchip)
                ) {
                    throw ResourceAlreadyExistsException(ANIMAL, "microchip", microchip)
                }
            }

            val updatedOwner =
                if (updatedAnimal.ownerEmail.isPresent) {
                    updatedAnimal.ownerEmail.get()?.let {
                        userRepository.findByEmail(it).orElseThrow {
                            ResourceNotFoundException(USER, it)
                        }
                    }
                } else {
                    null
                }

            if (updatedAnimal.ownerEmail.isPresent && updatedOwner != animal.owner) {
                updatedOwner?.let { animal.addOwner(it) } ?: animal.removeOwner()
            }

            animal.owner?.addAnimal(animal)

            animal.updateWith(
                name = updatedAnimal.name.orElse(animal.name),
                microchip = updatedAnimal.microchip.orElse(animal.microchip),
                sex = updatedAnimal.sex.orElse(animal.sex),
                sterilized = updatedAnimal.sterilized.orElse(animal.sterilized),
                birthDate = updatedAnimal.birthDate.orElse(animal.birthDate),
                species = updatedAnimal.species.orElse(animal.species),
                owner = if (updatedAnimal.ownerEmail.isPresent) updatedOwner else animal.owner,
            )

            animalRepository.save(animal).asPublic()
        }

    fun deleteAnimal(id: Long): Boolean =
        deleteResource(ANIMAL, id) {
            val animal =
                animalRepository.findById(id).orElseThrow {
                    ResourceNotFoundException(ANIMAL, id)
                }

            animal.removeOwner()
            animal.isActive = false

            animal.image?.let {
                storageService.deleteFile(it)
            }

            animalRepository.save(animal)

            true
        }

    private fun Animal.addOwner(updatedOwner: User) {
        executeOperation("update owner for", ANIMAL, this.id) {
            this.owner?.removeAnimal(this)

            this.owner = updatedOwner
            updatedOwner.addAnimal(this)

            userRepository.save(updatedOwner)
            animalRepository.save(this)
        }
    }

    private fun Animal.removeOwner() {
        executeOperation("remove owner from", ANIMAL, this.id) {
            this.owner?.removeAnimal(this)
            this.owner = null

            if (this.owner != null) {
                userRepository.save(this.owner!!)
            }
            animalRepository.save(this)
        }
    }
}
