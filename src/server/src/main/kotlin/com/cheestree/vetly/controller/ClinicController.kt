package com.cheestree.vetly.controller

import com.cheestree.vetly.domain.annotation.AuthenticatedRoute
import com.cheestree.vetly.domain.annotation.ProtectedRoute
import com.cheestree.vetly.domain.user.AuthenticatedUser
import com.cheestree.vetly.domain.user.roles.Role.ADMIN
import com.cheestree.vetly.domain.user.roles.Role.VETERINARIAN
import com.cheestree.vetly.http.api.ClinicApi
import com.cheestree.vetly.http.model.input.clinic.ClinicCreateInputModel
import com.cheestree.vetly.http.model.input.clinic.ClinicUpdateInputModel
import com.cheestree.vetly.http.model.output.ResponseList
import com.cheestree.vetly.http.model.output.clinic.ClinicInformation
import com.cheestree.vetly.http.model.output.clinic.ClinicPreview
import com.cheestree.vetly.http.path.Path
import com.cheestree.vetly.service.ClinicService
import org.springframework.data.domain.Sort
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import java.net.URI

@RestController
class ClinicController(
    private val clinicService: ClinicService,
) : ClinicApi {
    @AuthenticatedRoute
    override fun getClinics(
        name: String?,
        lat: Double?,
        lng: Double?,
        page: Int,
        size: Int,
        sortBy: String,
        sortDirection: Sort.Direction,
    ): ResponseEntity<ResponseList<ClinicPreview>> =
        ResponseEntity.ok(
            clinicService.getAllClinics(
                name = name,
                lat = lat,
                lng = lng,
                page = page,
                size = size,
                sortBy = sortBy,
                sortDirection = sortDirection,
            ),
        )

    @AuthenticatedRoute
    override fun getClinic(clinicId: Long): ResponseEntity<ClinicInformation> =
        ResponseEntity.ok(
            clinicService.getClinic(
                clinicId = clinicId,
            ),
        )

    @ProtectedRoute(ADMIN)
    override fun createClinic(
        authenticatedUser: AuthenticatedUser,
        clinic: ClinicCreateInputModel,
        image: MultipartFile?,
    ): ResponseEntity<Map<String, Long>> {
        val id =
            clinicService.createClinic(
                name = clinic.name,
                nif = clinic.nif,
                address = clinic.address,
                lng = clinic.lng,
                lat = clinic.lat,
                phone = clinic.phone,
                email = clinic.email,
                services = clinic.services,
                openingHours = clinic.openingHours,
                ownerEmail = clinic.ownerEmail,
                image = image,
            )
        val location = URI.create("${Path.Clinics.BASE}/$id")

        return ResponseEntity.created(location).body(mapOf("id" to id))
    }

    @ProtectedRoute(VETERINARIAN)
    override fun updateClinic(
        clinicId: Long,
        updateClinic: ClinicUpdateInputModel,
        image: MultipartFile?,
    ): ResponseEntity<Void> {
        clinicService.updateClinic(
            clinicId = clinicId,
            name = updateClinic.name,
            nif = updateClinic.nif,
            address = updateClinic.address,
            lng = updateClinic.lng,
            lat = updateClinic.lat,
            phone = updateClinic.phone,
            email = updateClinic.email,
            image = image,
        )
        return ResponseEntity.noContent().build()
    }

    @ProtectedRoute(ADMIN)
    override fun deleteClinic(clinicId: Long): ResponseEntity<Void> {
        clinicService.deleteClinic(clinicId)
        return ResponseEntity.noContent().build()
    }
}
