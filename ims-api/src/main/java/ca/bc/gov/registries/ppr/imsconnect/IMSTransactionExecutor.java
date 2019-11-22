package ca.bc.gov.registries.ppr.imsconnect;

import com.ibm.connector2.ims.ico.IMSInteraction;
import org.springframework.stereotype.Component;

import javax.resource.cci.Connection;
import javax.resource.cci.InteractionSpec;
import javax.resource.cci.Record;

@Component
public class IMSTransactionExecutor {
    private IMSManagedConnectionFactoryProperties imsManagedConnectionFactoryProperties;

    IMSTransactionExecutor(IMSManagedConnectionFactoryProperties imsManagedConnectionFactoryProperties) {
        this.imsManagedConnectionFactoryProperties = imsManagedConnectionFactoryProperties;
    }

    public Record executeTransaction(Record input, Record output, String mapName) throws Exception {
        Connection conn = imsManagedConnectionFactoryProperties.getIMSConnection(null, null);
        try {
            IMSInteraction interaction = (IMSInteraction) conn.createInteraction();
            try {
                InteractionSpec interactionSpec = imsManagedConnectionFactoryProperties.getInteractionSpec(mapName);
                interaction.execute(interactionSpec, input, output);
            }
            finally {
                interaction.close();
            }
        }
        finally {
            conn.close();
        }
        return output;
    }
}
