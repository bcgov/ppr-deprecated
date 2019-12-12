package ca.bc.gov.registries.ppr.search;

public class VehicleSummarySearchResult {
    private boolean exactMatch;
    private String type;
    private String vin;
    private int year;
    private String make;

    public VehicleSummarySearchResult(boolean exactMatch, String type, String vin, int year, String make) {
        this.exactMatch = exactMatch;
        this.type = type;
        this.vin = vin;
        this.year = year;
        this.make = make;
    }

    public boolean isExactMatch() {
        return exactMatch;
    }

    public String getType() {
        return type;
    }

    public String getVIN() {
        return vin;
    }

    public int getYear() {
        return year;
    }

    public String getMake() {
        return make;
    }
}
