package com.cheestree.vetly.misc

import com.cheestree.vetly.config.JacksonConfig
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.assertThrows
import java.time.OffsetDateTime
import java.time.ZoneOffset
import kotlin.test.Test

class CustomOffsetDateTimeSerializerTest {
    private val mapper = JacksonConfig().objectMapper()

    @Test
    fun `should serialize OffsetDateTime to custom format`() {
        val dateTime = OffsetDateTime.of(2025, 4, 14, 15, 0, 0, 0, ZoneOffset.UTC)
        val json = mapper.writeValueAsString(dateTime)
        val expected = "\"2025-04-14T15:00:00Z\""
        assertEquals(expected, json)
    }

    @Test
    fun `should deserialize OffsetDateTime from custom format`() {
        val json = "\"2025-04-14T15:00:00Z\""
        val parsed = mapper.readValue(json, OffsetDateTime::class.java)
        val expected = OffsetDateTime.of(2025, 4, 14, 15, 0, 0, 0, ZoneOffset.UTC)
        assertEquals(expected, parsed)
    }

    @Test
    fun `should also deserialize OffsetDateTime with explicit offset`() {
        val json = "\"2025-04-14T15:00:00+00:00\""
        val parsed = mapper.readValue(json, OffsetDateTime::class.java)
        val expected = OffsetDateTime.of(2025, 4, 14, 15, 0, 0, 0, ZoneOffset.UTC)
        assertEquals(expected, parsed)
    }

    @Test
    fun `should fail deserialization for invalid format`() {
        val invalidJson = "\"14/04/2025 15:00:00 +0000\""

        assertThrows<Exception> {
            mapper.readValue(invalidJson, OffsetDateTime::class.java)
        }
    }
}
