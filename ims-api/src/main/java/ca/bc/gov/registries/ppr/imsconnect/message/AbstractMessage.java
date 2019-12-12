package ca.bc.gov.registries.ppr.imsconnect.message;

import com.ibm.etools.marshall.RecordBytes;

import javax.resource.cci.Record;
import javax.resource.cci.Streamable;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import static ca.bc.gov.registries.ppr.imsconnect.message.ByteArrayUtils.*;

public abstract class AbstractMessage implements Record, RecordBytes, Streamable {
    protected static final int LL_INDEX = 0;
    protected static final int ZZ_INDEX = 2;
    protected static final int SHORT_LENGTH = 2;

    private String recordName;
    private String recordShortDescription;

    private byte[] buffer;

    protected AbstractMessage() {
        this.recordName = getClass().getName();
        this.recordShortDescription = getClass().getName();
        this.buffer = getDefaultBuffer().clone();
    }

    protected abstract byte[] getDefaultBuffer();

    protected short getMessageLength() {
        return readShort(LL_INDEX);
    }

    protected void writeString(String value, int offset, int length) {
        writeStringToBuffer(value, buffer, offset, length);
    }

    protected String readString(int offset, int length) {
        return readStringFromBuffer(buffer, offset, length).trim();
    }

    protected short readShort(int offset) {
        return readShortFromBuffer(buffer, offset);
    }

    protected int readStringAsInteger(int offset, int length) {
        return Integer.parseInt(readString(offset, length));
    }

    @Override
    public String getRecordName() {
        return recordName;
    }

    @Override
    public void setRecordName(String name) {
        this.recordName = name;
    }

    @Override
    public void setRecordShortDescription(String description) {
        this.recordShortDescription = description;
    }

    @Override
    public String getRecordShortDescription() {
        return recordShortDescription;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
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
