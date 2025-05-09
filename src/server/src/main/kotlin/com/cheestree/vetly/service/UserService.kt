package com.cheestree.vetly.service

import com.cheestree.vetly.domain.exception.VetException
import com.cheestree.vetly.domain.exception.VetException.ResourceNotFoundException
import com.cheestree.vetly.domain.user.User
import com.cheestree.vetly.domain.user.roles.Role
import com.cheestree.vetly.domain.user.userrole.UserRole
import com.cheestree.vetly.domain.user.userrole.UserRoleId
import com.cheestree.vetly.http.model.output.user.UserInformation
import com.cheestree.vetly.repository.RoleRepository
import com.cheestree.vetly.repository.UserRepository
import com.cheestree.vetly.repository.UserRoleRepository
import com.google.firebase.auth.FirebaseToken
import org.springframework.stereotype.Service
import java.util.Date
import java.util.UUID

@Service
class UserService(
    private val userRepository: UserRepository,
    private val userRoleRepository: UserRoleRepository,
    private val roleRepository: RoleRepository,
) {
    fun getSelfByUid(uid: String): UserInformation {
        return userRepository.getUserByUid(uid).orElseThrow {
            ResourceNotFoundException("User $uid not found")
        }.asPublic()
    }

    fun getUserByPublicId(publicId: UUID): UserInformation {
        return userRepository.findByPublicId(publicId).orElseThrow {
            ResourceNotFoundException("User $publicId not found")
        }.asPublic()
    }

    fun getUserByUid(uid: String): User? {
        return userRepository.findByUid(uid).orElse(null)
    }

    fun findUserByUid(uid: String): User? {
        return userRepository.findByUid(uid).orElse(null)
    }

    fun createUser(firebaseUser: FirebaseToken): User {
        return userRepository.findByUid(firebaseUser.uid).orElseGet {
            val newUser =
                User(
                    uid = firebaseUser.uid,
                    username = firebaseUser.name,
                    email = firebaseUser.email,
                    imageUrl = firebaseUser.picture,
                )
            userRepository.save(newUser)
        }
    }

    fun updateUserProfile(
        userId: Long,
        username: String? = null,
        imageUrl: String? = null,
        phone: Int? = null,
        birthDate: Date? = null,
    ): UserInformation {
        val user =
            userRepository.findById(userId).orElseThrow {
                ResourceNotFoundException("User $userId not found")
            }

        user.updateWith(username, imageUrl, phone, birthDate)

        return userRepository.save(user).asPublic()
    }

    fun updateUserRole(
        userId: Long,
        role: Role,
    ) {
        val roleEntity =
            roleRepository.findByRole(role).orElseThrow {
                VetException.BadRequestException("Role $role not found")
            }

        val user =
            userRepository.findById(userId).orElseThrow {
                ResourceNotFoundException("User $userId not found")
            }

        if (userRoleRepository.existsById(UserRoleId(user.id, roleEntity.id))) {
            throw IllegalStateException("User already has this role assigned")
        }

        val userRole =
            UserRole(
                id = UserRoleId(userId = user.id, roleId = roleEntity.id),
                user = user,
                role = roleEntity,
            )

        user.addRole(userRole)

        userRepository.save(user)
        userRoleRepository.save(userRole)
    }
}
