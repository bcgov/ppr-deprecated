package ca.bc.gov.registries.ppr.imsconnect.message;

import static com.ibm.etools.marshall.util.MarshallIntegerUtils.*;
import static com.ibm.etools.marshall.util.MarshallStringUtils.*;

public class ByteArrayUtils {
    public static final String EBCDIC_CHAR_SET = "cp037";
    private static final String PAD_SPACE = " ";

    public static void writeStringToBuffer(String value, byte[] buffer, int offset, int length) {
        writeStringToBuffer(value, buffer, offset, length, STRING_JUSTIFICATION_LEFT);
    }

    public static void writeStringToBuffer(String value, byte[] buffer, int offset, int length, int justification) {
        marshallFixedLengthStringIntoBuffer(value, buffer, offset, EBCDIC_CHAR_SET, length, justification, PAD_SPACE);
    }

    public static String readStringFromBuffer(byte[] buffer, int offset, int length) {
        return unmarshallFixedLengthStringFromBuffer(buffer, offset, EBCDIC_CHAR_SET, length);
    }

    public static void writeShortToBuffer(short value, byte[] buffer, int offset) {
        marshallTwoByteIntegerIntoBuffer(value, buffer, offset, true, SIGN_CODING_TWOS_COMPLEMENT);
    }

    public static short readShortFromBuffer(byte[] buffer, int offset) {
        return unmarshallTwoByteIntegerFromBuffer(buffer, offset, true, SIGN_CODING_TWOS_COMPLEMENT);
    }
}
