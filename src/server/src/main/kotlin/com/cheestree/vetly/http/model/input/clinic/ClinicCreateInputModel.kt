package com.cheestree.vetly.http.model.input.clinic

import com.cheestree.vetly.domain.clinic.service.ServiceType
import com.cheestree.vetly.http.model.input.request.RequestExtraData
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import org.hibernate.validator.constraints.Range
import javax.annotation.Nullable

data class ClinicCreateInputModel(
    @field:NotBlank(message = "Name is required")
    val name: String,
    @field:NotBlank(message = "NIF is required")
    val nif: String,
    @field:NotBlank(message = "Address is required")
    val address: String,
    @field:Range(min = -180, max = 180, message = "Longitude must be between -180 and 180")
    val lng: Double,
    @field:Range(min = -90, max = 90, message = "Latitude must be between -90 and 90")
    val lat: Double,
    @field:NotBlank(message = "Phone is required")
    val phone: String,
    @field:Email(message = "Email is required")
    val email: String,
    val services: Set<ServiceType>,
    val openingHours: List<OpeningHourInputModel>,
    @field:Nullable
    @field:Email(message = "Owner email is required")
    val ownerEmail: String?,
) : RequestExtraData
