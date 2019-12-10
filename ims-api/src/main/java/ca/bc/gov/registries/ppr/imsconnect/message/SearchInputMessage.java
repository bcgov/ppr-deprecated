package ca.bc.gov.registries.ppr.imsconnect.message;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import static com.ibm.etools.marshall.util.MarshallIntegerUtils.SIGN_CODING_TWOS_COMPLEMENT;
import static com.ibm.etools.marshall.util.MarshallIntegerUtils.marshallTwoByteIntegerIntoBuffer;
import static com.ibm.etools.marshall.util.MarshallStringUtils.*;

public class SearchInputMessage extends AbstractMessage {
    private static final short MESSAGE_SIZE = 545;
    private static final byte[] DEFAULT_BUFFER = new byte[MESSAGE_SIZE];
    private static final String PAD_SPACE = " ";
    private static final String VERSION = "V2";

    private static final String DEFAULT_SEARCH_TX = "OLPPTSE";
    private static final int DEFAULT_LIMIT = 200;
    private static final String DEFAULT_FUNCTION = "09";
    private static final String DEFAULT_MODEL = "3270-A02";
    private static final String DEFAULT_PRINTER = "XPSP0051"; // TODO Should this be variable by Environment?

    private static final int SERIAL_INDEX = 126;
    private static final int SERIAL_LENGTH = 25;

    private byte[] buffer;

    static {
        writeShortToBuffer(MESSAGE_SIZE, DEFAULT_BUFFER,0); // 2 bytes, "LL" - message length
        writeShortToBuffer((short) 0, DEFAULT_BUFFER,2); // 2 bytes, "ZZ"
        writeStringToBuffer(DEFAULT_SEARCH_TX, DEFAULT_BUFFER, 4, 8); // Transaction Name
        writeStringToBuffer("", DEFAULT_BUFFER, 12, 2); // EMPTY Space before function
        writeStringToBuffer(DEFAULT_FUNCTION, DEFAULT_BUFFER, 14, 2); // Function code
        writeStringToBuffer("", DEFAULT_BUFFER, 16, 2); // empty space after function
        writeStringToBuffer(DEFAULT_SEARCH_TX, DEFAULT_BUFFER, 18, 8); // Transaction Name
        writeStringToBuffer("", DEFAULT_BUFFER, 26, 1);   // More empty space
        writeStringToBuffer("", DEFAULT_BUFFER, 27, 1);   // DOLLAR
        writeStringToBuffer("", DEFAULT_BUFFER, 28, 63);  // FILL for PFK, OLBCMODE and KEY
        writeStringToBuffer(VERSION, DEFAULT_BUFFER, 91, 4);    // Version
        writeStringToBuffer("", DEFAULT_BUFFER, 95, 15);  // FOLIO
        writeStringToBuffer(DEFAULT_PRINTER, DEFAULT_BUFFER, 110, 8);  // Printer
        writeStringToBuffer(DEFAULT_MODEL, DEFAULT_BUFFER, 118, 8);  // Model
        writeStringToBuffer("", DEFAULT_BUFFER, SERIAL_INDEX, 415); // various search criteria
        writeStringToBuffer(Integer.toString(DEFAULT_LIMIT), DEFAULT_BUFFER, 541, 4, STRING_JUSTIFICATION_RIGHT); // limit
    }

    private static void writeStringToBuffer(String value, byte[] buffer, int offset, int length) {
        writeStringToBuffer(value, buffer, offset, length, STRING_JUSTIFICATION_LEFT);
    }

    private static void writeStringToBuffer(String value, byte[] buffer, int offset, int length, int justification) {
        marshallFixedLengthStringIntoBuffer(value, buffer, offset, EBCDIC_CHAR_SET, length, justification, PAD_SPACE);
    }

    private static void writeShortToBuffer(short value, byte[] buffer, int offset) {
        marshallTwoByteIntegerIntoBuffer(value, buffer, offset, true, SIGN_CODING_TWOS_COMPLEMENT);
    }

    private static String readStringFromBuffer(byte[] buffer, int offset, int length) {
        return unmarshallFixedLengthStringFromBuffer(buffer, offset, EBCDIC_CHAR_SET, length);
    }

    public SearchInputMessage(String serial) {
        super();
        initialize(serial);
    }

    private void initialize(String serial) {
        buffer = DEFAULT_BUFFER.clone();
        writeStringToBuffer(serial, buffer, SERIAL_INDEX, SERIAL_LENGTH);
    }

    public String getSerial() {
        return readStringFromBuffer(buffer, SERIAL_INDEX, SERIAL_LENGTH).trim();
    }

    @Override
    public byte[] getBytes() {
        return buffer.clone();
    }

    @Override
    public void setBytes(byte[] bytes) {
        if ((bytes != null) && (bytes.length != 0)) {
            buffer = bytes.clone();
        }
    }

    @Override
    public int getSize() {
        return buffer.length;
    }

    @Override
    public void read(InputStream inputStream) throws IOException {
        byte[] input = new byte[inputStream.available()];
        inputStream.read(input);
        buffer = input;
    }

    @Override
    public void write(OutputStream outputStream) throws IOException {
        outputStream.write(buffer, 0, getSize());
    }
}
