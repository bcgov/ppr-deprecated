package ca.bc.gov.registries.ppr.imsconnect.message;

import com.ibm.etools.marshall.RecordBytes;

import javax.resource.cci.Record;
import javax.resource.cci.Streamable;

public abstract class AbstractMessage implements Record, RecordBytes, Streamable {
    public static final String EBCDIC_CHAR_SET = "1141";

    private String recordName;
    private String recordShortDescription;

    protected AbstractMessage() {
        this.recordName = getClass().getName();
        this.recordShortDescription = getClass().getName();
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
}
