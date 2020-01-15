package ca.bc.gov.registries.ppr.imsconnect.poolmanager;

import com.ibm.connector2.spi.ConnectionPoolProperties;
import com.ibm.connector2.spi.ConnectionStateChangeObserver;
import com.ibm.connector2.spi.ConnectionStateChangeParticipant;
import com.ibm.connector2.spi.PoolManager;

import javax.resource.ResourceException;
import javax.resource.spi.ConnectionRequestInfo;
import javax.resource.spi.ManagedConnection;
import javax.resource.spi.ManagedConnectionFactory;
import javax.resource.spi.ResourceAllocationException;
import javax.security.auth.Subject;
import java.io.PrintWriter;
import java.util.Vector;

/**
 * A pooling implementation to manage connection pools to IMS.
 * This class is adapted from https://github.com/imsdev/ims-java-springboot/blob/master/ims-springboot-tm/src/main/java/sample/ims/poolmanager/PoolManagerImpl.java
 */
public class PoolManagerImpl implements PoolManager {

	private PrintWriter pw = null;
	private Vector<ManagedConnection> connectionPool = null;
	private int totalConnections = 0;

	
	public void addConnectionStateChangeObserver(ConnectionStateChangeObserver arg0) {
		// TODO Auto-generated method stub

	}

	public void addConnectionStateChangeParticipant(ConnectionStateChangeParticipant arg0) {
		// TODO Auto-generated method stub

	}

	public PrintWriter getLogWriter() {
		return pw;
	}

	public void removeConnectionStateChangeObserver(ConnectionStateChangeObserver arg0) {
		// TODO Auto-generated method stub

	}

	public void removeConnectionStateChangeParticipant(ConnectionStateChangeParticipant arg0) {
		// TODO Auto-generated method stub

	}

	public void setLogWriter(PrintWriter pw) {
		this.pw = pw;
	}

	public void clearForAffinityID(Object arg0) {
		// TODO Auto-generated method stub
		
	}

	public void delete(ManagedConnection mc, Object arg1) {
		try {
			totalConnections--;
			if (mc != null) mc.destroy();
		} catch (ResourceException e) {
			e.printStackTrace();
		}
	}

	public ManagedConnectionFactory lookupFactory(ManagedConnection arg0) {
		// TODO Auto-generated method stub
		return null;
	}

	public Subject lookupSubject(ManagedConnection arg0) {
		// TODO Auto-generated method stub
		return null;
	}

	public void release(ManagedConnection mc, Object arg1) {
		logTrace(" >>> PoolManager.release()");
		try {
			mc.cleanup();
			putMCtoVector(mc);
		} catch (ResourceException e) {
			e.printStackTrace();
		}
		logTrace(" <<< PoolManager.release()");
	}

	public ManagedConnection reserve(ManagedConnectionFactory factory,
			ConnectionPoolProperties poolProps, Subject arg2,
			ConnectionRequestInfo reqInfo, Object arg4, boolean arg5)
			throws ResourceAllocationException {
		logTrace(" >>> PoolManager.reserve()");
		if (connectionPool == null) {
			try {
				initialize(factory, poolProps, reqInfo);
			} catch (ResourceException e) {
				e.printStackTrace();				
				throw  new ResourceAllocationException(e.getMessage(), e.getCause());
			}
		}
		try {			
			ManagedConnection mc = getMCfromVector(factory, poolProps, reqInfo); 
			logTrace(" <<< PoolManager.reserve()");
			return mc;
		} catch (ResourceException e) {
			e.printStackTrace();
			return null;
		}

	}

    private synchronized void logTrace(String msg)
    {
        if (pw != null) {
            pw.println(msg);
            pw.flush();
        }
    }

    //initialize the vector and add minConnections physical connections as a starter
	private synchronized void initialize(ManagedConnectionFactory factory, ConnectionPoolProperties poolProps,
			ConnectionRequestInfo reqInfo) throws ResourceException {
		logTrace(" >>> PoolManager.initialize() " + poolProps.getMinConnections());
		connectionPool = new Vector<>();
		for (int i=0; i<(poolProps.getMinConnections()); i++ ) {
			connectionPool.addElement(factory.createManagedConnection(null, reqInfo));
			totalConnections++;
		}		
		logTrace(" <<< PoolManager.initialize()");
	}

	//used to get a managed connection from the pool or create a new one when none is left in the pool
	private synchronized ManagedConnection getMCfromVector(ManagedConnectionFactory factory, ConnectionPoolProperties poolProps,
			ConnectionRequestInfo reqInfo) throws ResourceException {
		logTrace(" >>> PoolManager.getMCfromVector() " + connectionPool.size());
		if (connectionPool.size() > 0) {
			ManagedConnection mc = connectionPool.firstElement();
			connectionPool.removeElementAt(0);
			return mc;
		} else {
			if (totalConnections < poolProps.getMaxConnections()) {
				totalConnections++;
				return factory.createManagedConnection(null, reqInfo);
			} else {
				throw new ResourceAllocationException("No connection available", "Max. PoolSize of " + poolProps.getMaxConnections() + " exceeded.");
			}
		}
	}
	
	//used to put a managed connection into the pool
	private synchronized void putMCtoVector(ManagedConnection mc) {
		logTrace(" >>> PoolManager.putMCtoVector() " + connectionPool.size());
		connectionPool.addElement(mc);
		logTrace(" <<< PoolManager.putMCtoVector() " + connectionPool.size());
	}

    //stopping the pool and cleaning up everything
    public void stop() {
		logTrace(" >>> PoolManager.stop() " + connectionPool.size());
    	ManagedConnection mc;
    	if (connectionPool != null) {
    	  while (connectionPool.size() > 0) {
    		mc = connectionPool.firstElement();
    		connectionPool.removeElementAt(0);
			totalConnections--;
    		try {
				mc.cleanup();
			} catch (ResourceException e) {
				e.printStackTrace();
			}
    		try {
				mc.destroy();
			} catch (ResourceException e) {
				e.printStackTrace();
			}
    	  }
    	  connectionPool = null;
    	}
		logTrace(" <<< PoolManager.stop() " + totalConnections);
    }

}
