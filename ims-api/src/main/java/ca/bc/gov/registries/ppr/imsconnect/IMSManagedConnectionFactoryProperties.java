package ca.bc.gov.registries.ppr.imsconnect;

import ca.bc.gov.registries.ppr.imsconnect.poolmanager.PoolManagerImpl;
import com.ibm.connector2.ims.ico.*;
import com.ibm.connector2.spi.DefaultConnectionManager;
import com.ibm.connector2.spi.DefaultConnectionPoolProperties;
import com.ibm.connector2.spi.PoolManager;
import com.ibm.j2ca.extension.logging.LogUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PreDestroy;
import javax.resource.ResourceException;
import javax.resource.cci.Connection;
import javax.resource.cci.InteractionSpec;
import java.util.logging.Logger;

/**
 * A configuration for holding IMS Connection settings.  It provides a single method to access an IMS connection.
 * This class is adapted from https://github.com/imsdev/ims-java-springboot/blob/master/ims-springboot-tm/src/main/java/sample/ims/springboot/inbound/IMSManagedConnectionFactoryProperties.java
 */
@Component
public class IMSManagedConnectionFactoryProperties implements InitializingBean {
	private IMSManagedConnectionFactory mcf = null;

	@Value("${ims.hostname}")
	private String hostname;
	@Value("${ims.port}")
	private int port;
	@Value("${ims.data_store}")
	private String dataStore;
	@Value("${ims.username}")
	private String username;
	@Value("${ims.password}")
	private String password;
	@Value("${ims.group:}")
	private String group;
	@Value("${ims.execution_timeout:25000}")
	private int executionTimeout;
	@Value("${ims.socket_timeout:30000}")
	private int socketTimeout;

	@Value("${ims.pooling_enabled:false}")
	private boolean poolingEnabled;
	@Value("${ims.min_connections:1}")
	private int minConnections;
	@Value("${ims.max_connections:5}")
	private int maxConnections;
	@Value("${ims.ssl_enabled:false}")
	private boolean sslEnabled;

	@Value("${ims.l_term:}")
	private String lTerm;

	private PoolManager poolManager = null;
	private DefaultConnectionPoolProperties connPoolProps = null;
	private DefaultConnectionManager connMgr = null;
	private IMSConnectionFactory icf = null;

	@Override
	public void afterPropertiesSet() throws Exception {
		mcf =  new IMSManagedConnectionFactory();

		mcf.setHostName(hostname);
		mcf.setDataStoreName(dataStore);
		mcf.setPortNumber(port);
		mcf.setUserName(username);
		mcf.setPassword(password);
		mcf.setGroupName(group);
		mcf.setSSLEnabled(sslEnabled);

		//IMSTMRA uses java.util.logging
		final Logger universalLogger = Logger.getLogger("com.ibm.j2ca");
		LogUtils logUtils = new LogUtils(new IMSResourceAdapter(), true);
		//using slf4j does not work here, the cast to java.util.logging fails
		logUtils.setLogger(universalLogger);
		mcf.setLogUtil(logUtils);

		if (poolingEnabled) {
			//create DefaultPoolManagerProperties
			connPoolProps = new DefaultConnectionPoolProperties();
			connPoolProps.setMinConnections(minConnections);
			connPoolProps.setMaxConnections(maxConnections);

			//Create PoolManager
			poolManager = new PoolManagerImpl();

			//Create DefaultConnectionManager
			connMgr = new DefaultConnectionManager();
			connMgr.setConnectionPoolProperties(connPoolProps);
			//connMgr.setLogWriter(logWriter);
			DefaultConnectionManager.setPoolManager(poolManager);

			//create ConnectionFactory with pool manager
			icf = (IMSConnectionFactory) mcf.createConnectionFactory(connMgr);
		} else {
			//create ConnectionFactory with out pool manager
			icf = (IMSConnectionFactory) mcf.createConnectionFactory();
		}
	}

	//username and password can be null, then mcf username and password are used
	public Connection getIMSConnection(String username, String password) throws ResourceException {
		//set username and password for this connection request
		IMSConnectionSpec ics = new IMSConnectionSpec();
		ics.setUserName(username);
		ics.setPassword(password);

		return icf.getConnection(ics);
	}

	public InteractionSpec getInteractionSpec(String mapName) throws Exception {
		IMSInteractionSpec interactionSpec = new IMSInteractionSpec();
		interactionSpec.setMapName(mapName);
		interactionSpec.setInteractionVerb(IMSInteractionSpec.SYNC_SEND_RECEIVE );
		interactionSpec.setCommitMode(IMSInteractionSpec.SEND_THEN_COMMIT);
		interactionSpec.setSyncLevel(IMSInteractionSpec.SYNC_LEVEL_NONE);
		interactionSpec.setUseConvID(true);
		interactionSpec.setExecutionTimeout(executionTimeout);
		interactionSpec.setSocketTimeout(socketTimeout);
		interactionSpec.setLtermName(lTerm);

		return interactionSpec;
	}

	@PreDestroy
	public void destroy() {
		//cleanup all connection still in the pool
		if (poolManager != null) {
			((PoolManagerImpl)poolManager).stop();
		}
	}
}