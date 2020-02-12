import geb.Page

class EntityDashboardPage extends Page {

    static at = { title == "" }

    static content = {
        entityInfo {$('#entity-info')}
        entityLegalname {$('#entity-info #entity-legal-name')}
        entityStatus {$('#entity-info #entity-status .v-chip__content')} // currently nothing displays
        entityBusinessnumber {$('#entity-info #entity-business-number')}
        entityIncorporationNumber {$('#entity-info #entity-incorporation-number')}
        entityBusinessemail {$('#entity-info #entity-business-email')}
        entityBusinessphone {$('#entity-info #entity-business-phone')}
        entitySettingsbutton {$('#entity-info #entity-settings-button')}
        updateBusinessprofilemenuitem {$('#entity-info #update-business-profile-menuitem')} // drop-down menu must first be visible

        dashboard { $('#dashboard') }
        dashboardWarningdlg { $('#dashboard .coa-warning-dialog') } // empty unless displayed
        dashboardTitle { $('#dashboard [data-test-id="dashboard-title"]') }
        dashboardTodosubtitle { $('#dashboard [data-test-id="dashboard-todo-subtitle"]') }
        dashboardFilinghistorysubtitle { $('#dashboard [data-test-id="dashboard-filing-history-subtitle"]') }
        dashboardAddresssubtitle { $('#dashboard [data-test-id="dashboard-addresses-subtitle"]') }
        dashboardAddressbutton { $('#dashboard #standalone-addresses-button') }
        dashboardDirectorssubtitle { $('#dashboard [data-test-id="dashboard-directors-subtitle"]') }
        dashboardDirectorsbutton { $('#dashboard #standalone-directors-button') }
    }
}
