package com.cheestree.vetly.domain.user.roles

import com.cheestree.vetly.domain.user.userrole.types.AdminRole
import com.cheestree.vetly.domain.user.userrole.types.VeterinarianRole
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Inheritance
import jakarta.persistence.InheritanceType
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = VeterinarianRole::class, name = "veterinarian"),
    JsonSubTypes.Type(value = AdminRole::class, name = "admin"),
)
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "roles", schema = "vetly")
abstract class RoleEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open val id: Long = 0,
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    open val role: Role,
    open val description: String? = null,
)
