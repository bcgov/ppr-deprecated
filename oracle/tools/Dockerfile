FROM store/oracle/database-enterprise:12.2.0.1
USER root

LABEL name="OraclePPR" \ 
    maintainer="BC Registries" \
    version="0.1" \
    description="Oracle Enterprise for OpenShift"

ARG UID_O=1005579999
ARG USERNAME=pprTest

RUN useradd -l -u ${UID_O} -g 0 -G 0,54321,54322 ${USERNAME} && \
    mkdir /import && \
    chmod -R 775 /import

COPY bin/uid_entrypoint /home/uid_entrypoint
COPY bin/dockerInit2.sh /home/oracle/setup/dockerInit2.sh
COPY bin/startupDB2.sh /home/oracle/setup/startupDB2.sh
COPY bin/shutDB2.sh /home/oracle/setup/shutDB2.sh
COPY bin/setupDB2.sh /home/oracle/setup/setupDB2.sh
COPY bin/configDB2.sh /home/oracle/setup/configDB2.sh
COPY bin/configDBora2.sh /home/oracle/setup/configDBora2.sh
COPY bin/untarDB2.sh /home/oracle/setup/untarDB2.sh

RUN \
    chown -R ${UID_O} /ORCL && \
    chown -R ${UID_O} /u01 && \
    chown -R ${UID_O} /u02 && \
    chown -R ${UID_O} /u03 && \
    chown -R ${UID_O} /u04 && \
    chown -R ${UID_O} /home && \
    chmod 775 -R /home/oracle/setup && \
    chgrp -R 0 /ORCL && \
    chmod -R g=u /ORCL && \
    chgrp -R 0 /u01 && \
    chmod -R g=u /u01 && \
    chgrp -R 0 /u02 && \
    chmod -R g=u /u02 && \
    chgrp -R 0 /u03 && \
    chmod -R g=u /u03 && \
    chgrp -R 0 /u04 && \
    chmod -R g=u /u04 && \
    chgrp -R 0 /home && \
    chmod -R g=u /home && \
    chmod g=u /etc/passwd

USER ${UID_O}
ENTRYPOINT [ "/home/uid_entrypoint" ]
EXPOSE 1521:5500
ENTRYPOINT ["/home/oracle/setup/dockerInit2.sh"]
