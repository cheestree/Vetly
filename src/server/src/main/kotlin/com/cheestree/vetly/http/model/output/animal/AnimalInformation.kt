package com.cheestree.vetly.http.model.output.animal

import com.cheestree.vetly.domain.animal.sex.Sex
import com.cheestree.vetly.http.model.output.file.FileInformation
import com.cheestree.vetly.http.model.output.user.UserPreview
import java.time.OffsetDateTime

data class AnimalInformation(
    val id: Long,
    val name: String,
    val microchip: String?,
    val sex: Sex,
    val sterilized: Boolean,
    val species: String?,
    val birthDate: OffsetDateTime?,
    val image: FileInformation?,
    val age: Int?,
    val owner: UserPreview?,
)
