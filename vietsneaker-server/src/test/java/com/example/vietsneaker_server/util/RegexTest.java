package com.example.vietsneaker_server.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RegexTest {

    @Test
    void testDatetimeRegex1_Valid() {
        assertTrue("2024-01-01 12:30".matches(Regex.DATETIME_REGEX_1));
        assertTrue("2024-03-31 23:59".matches(Regex.DATETIME_REGEX_1));
        assertTrue("2024-04-30 00:00".matches(Regex.DATETIME_REGEX_1));
        assertTrue("2024-02-29 10:00".matches(Regex.DATETIME_REGEX_1));
    }

    @Test
    void testDatetimeRegex1_Invalid() {
        assertFalse("2024-02-30 10:00".matches(Regex.DATETIME_REGEX_1)); // Invalid day for February
        assertFalse("2024-04-31 10:00".matches(Regex.DATETIME_REGEX_1)); // Invalid day for April
        assertFalse("2024-13-01 10:00".matches(Regex.DATETIME_REGEX_1)); // Invalid month
        assertFalse("2024-01-01 24:00".matches(Regex.DATETIME_REGEX_1)); // Invalid hour
        assertFalse("2024-01-01 12:60".matches(Regex.DATETIME_REGEX_1)); // Invalid minute
        assertFalse("2024-1-1 12:30".matches(Regex.DATETIME_REGEX_1)); // Invalid format
    }

    @Test
    void testDateRegex1_Valid() {
        assertTrue("2024-01-01".matches(Regex.DATE_REGEX_1));
        assertTrue("2024-03-31".matches(Regex.DATE_REGEX_1));
        assertTrue("2024-04-30".matches(Regex.DATE_REGEX_1));
        assertTrue("2024-02-29".matches(Regex.DATE_REGEX_1));
    }

    @Test
    void testDateRegex1_Invalid() {
        assertFalse("2024-02-30".matches(Regex.DATE_REGEX_1)); // Invalid day for February
        assertFalse("2024-04-31".matches(Regex.DATE_REGEX_1)); // Invalid day for April
        assertFalse("2024-13-01".matches(Regex.DATE_REGEX_1)); // Invalid month
        assertFalse("2024-1-1".matches(Regex.DATE_REGEX_1));   // Invalid format
    }

    @Test
    void testPhoneRegex1_Valid() {
        assertTrue("0123456789".matches(Regex.PHONE_REGEX_1));
        assertTrue("09876543210".matches(Regex.PHONE_REGEX_1));
    }

    @Test
    void testPhoneRegex1_Invalid() {
        assertFalse("1234567890".matches(Regex.PHONE_REGEX_1)); // Does not start with 0
        assertFalse("012345678".matches(Regex.PHONE_REGEX_1));  // Too short
    }
}
