package ca.bc.gov.registries.ppr.imsconnect.message;

import ca.bc.gov.registries.ppr.search.VehicleSummarySearchResult;

import java.util.ArrayList;
import java.util.List;

import static ca.bc.gov.registries.ppr.imsconnect.message.ByteArrayUtils.writeShortToBuffer;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

public class SearchOutputMessage extends AbstractMessage {
    private static final short MESSAGE_SIZE = 1817;
    private static final byte[] DEFAULT_BUFFER = new byte[MESSAGE_SIZE];
    private static final int FIELD_PREFIX_LENGTH = SHORT_LENGTH * 2;

    private static final int VERSION_LENGTH = 4;
    private static final int EFFECTIVE_DATE_LENGTH = 17;
    private static final int APPLICATION_ID_LENGTH = 33;
    private static final int RACF_ID_LENGTH = 8;
    private static final int RACF_NAME_LENGTH = 40;
    private static final int SYS_MSG_LENGTH = 79;
    private static final int TRANSACTION_LENGTH = 2;
    private static final int MODE_LENGTH = 1;
    private static final int KEY_LENGTH = 60;
    private static final int FOLIO_LENGTH = 15;
    private static final int PRINTER_LENGTH = 8;
    private static final int EXACT_LABEL_LENGTH = 12;
    private static final int EXACT_MATCH_NUM_LENGTH = 4;
    private static final int CANCEL_LABEL_LENGTH = 28;
    private static final int CONFIRM_CANCEL_LENGTH = 1;
    private static final int SERIAL_LENGTH = 25;
    private static final int LIMIT_LENGTH = 4;

    private static final int VEHICLE_CONV_LENGTH = 1;
    private static final int VEHICLE_SELECTION_LENGTH = 1;
    private static final int VEHICLE_TYPE_LENGTH = 2;
    private static final int VEHICLE_VIN_LENGTH = 25;
    private static final int VEHICLE_YEAR_LENGTH = 4;
    private static final int VEHICLE_MAKE_LENGTH = 25;
    private static final int VEHICLE_LENGTH = VEHICLE_CONV_LENGTH + FIELD_PREFIX_LENGTH + VEHICLE_SELECTION_LENGTH + VEHICLE_TYPE_LENGTH + VEHICLE_VIN_LENGTH + VEHICLE_YEAR_LENGTH + VEHICLE_MAKE_LENGTH;
    private static final int VEHICLE_COUNT = 23;

    private static final int APPLICATION_ID_INDEX = ZZ_INDEX + SHORT_LENGTH /* ZZ */ + VERSION_LENGTH + SHORT_LENGTH /* SCA */ + EFFECTIVE_DATE_LENGTH;
    private static final int RACF_ID_INDEX = APPLICATION_ID_INDEX + APPLICATION_ID_LENGTH;
    private static final int SYS_MSG_INDEX = RACF_ID_INDEX + RACF_ID_LENGTH + RACF_NAME_LENGTH;
    private static final int TRANSACTION_INDEX = SYS_MSG_INDEX + SYS_MSG_LENGTH + FIELD_PREFIX_LENGTH;
    private static final int FOLIO_INDEX = TRANSACTION_INDEX + TRANSACTION_LENGTH + MODE_LENGTH + KEY_LENGTH + (FIELD_PREFIX_LENGTH * 3);
    private static final int EXACT_MATCH_NUM_INDEX = FOLIO_INDEX + FOLIO_LENGTH + PRINTER_LENGTH + EXACT_LABEL_LENGTH + (FIELD_PREFIX_LENGTH * 3);
    private static final int SERIAL_INDEX = EXACT_MATCH_NUM_INDEX + EXACT_MATCH_NUM_LENGTH + CANCEL_LABEL_LENGTH + CONFIRM_CANCEL_LENGTH + (FIELD_PREFIX_LENGTH * 3);
    private static final int VEHICLE_LIST_INDEX = SERIAL_INDEX + SERIAL_LENGTH;
    private static final int LIMIT_INDEX = VEHICLE_LIST_INDEX + (VEHICLE_LENGTH * VEHICLE_COUNT);

    private static final int VEHICLE_SELECTION_INDEX = 1;
    private static final int VEHICLE_TYPE_INDEX = VEHICLE_SELECTION_INDEX + FIELD_PREFIX_LENGTH + VEHICLE_SELECTION_LENGTH;
    private static final int VEHICLE_VIN_INDEX = VEHICLE_TYPE_INDEX + VEHICLE_TYPE_LENGTH;
    private static final int VEHICLE_YEAR_INDEX = VEHICLE_VIN_INDEX + VEHICLE_VIN_LENGTH;
    private static final int VEHICLE_MAKE_INDEX = VEHICLE_YEAR_INDEX + VEHICLE_YEAR_LENGTH;

    private static final String EXACT_MATCH_SELECTION = "E";

    static {
        writeShortToBuffer(MESSAGE_SIZE, DEFAULT_BUFFER, LL_INDEX); // 2 bytes, "LL" - message length
        writeShortToBuffer((short) 0, DEFAULT_BUFFER, ZZ_INDEX); // 2 bytes, "ZZ"
    }

    public SearchOutputMessage() {
        super();
    }

    public String getApplicationId() {
        return readString(APPLICATION_ID_INDEX, APPLICATION_ID_LENGTH);
    }

    public String getUsername() {
        return readString(RACF_ID_INDEX, RACF_ID_LENGTH);
    }

    public int getLimit() {
        return Integer.parseInt(readField(LIMIT_INDEX, LIMIT_LENGTH).getValue());
    }

    public String getSystemMessage() {
        return readField(SYS_MSG_INDEX, SYS_MSG_LENGTH).getValue();
    }

    public String getTransaction() {
        return readField(TRANSACTION_INDEX, TRANSACTION_LENGTH).getValue();
    }

    public String getFolio() {
        return readField(FOLIO_INDEX, FOLIO_LENGTH).getValue();
    }

    public int getExactMatchCount() {
        String stringCount = readField(EXACT_MATCH_NUM_INDEX, EXACT_MATCH_NUM_LENGTH).getValue();
        return isNotBlank(stringCount) ? Integer.parseInt(stringCount) : 0;
    }

    public String getSerial() {
        return readString(SERIAL_INDEX, SERIAL_LENGTH);
    }

    public List<VehicleSummarySearchResult> getVehicles() {
        List<VehicleSummarySearchResult> result = new ArrayList<>();
        for (int i = 0; i < VEHICLE_COUNT; i++) {
            int baseIndex = VEHICLE_LIST_INDEX + (VEHICLE_LENGTH * i);

            String selection = readField(baseIndex + VEHICLE_SELECTION_INDEX, VEHICLE_SELECTION_LENGTH).getValue();
            if (isBlank(selection)) {
                // When we find an empty value we've reached the end of the results
                break;
            }

            VehicleSummarySearchResult vehicle = new VehicleSummarySearchResult(
                    selection.equals(EXACT_MATCH_SELECTION),
                    readString(baseIndex + VEHICLE_TYPE_INDEX, VEHICLE_TYPE_LENGTH),
                    readString(baseIndex + VEHICLE_VIN_INDEX, VEHICLE_VIN_LENGTH),
                    readStringAsInteger(baseIndex + VEHICLE_YEAR_INDEX, VEHICLE_YEAR_LENGTH),
                    readString(baseIndex + VEHICLE_MAKE_INDEX, VEHICLE_MAKE_LENGTH)
            );
            result.add(vehicle);
        }
        return result;
    }

    @Override
    protected byte[] getDefaultBuffer() {
        return DEFAULT_BUFFER;
    }

    private Field readField(int offset, int valueLength) {
        return new Field(
                readShort(offset),
                readShort(offset + SHORT_LENGTH),
                readString(offset + FIELD_PREFIX_LENGTH, valueLength)
        );
    }

    private class Field {
        private String value;
        private short colour;
        private short attribute;

        private Field(short attribute, short colour, String value) {
            this.attribute = attribute;
            this.colour = colour;
            this.value = value;
        }

        public short getAttribute() {
            return attribute;
        }

        public short getColour() {
            return colour;
        }

        public String getValue() {
            return value;
        }
    }

}
