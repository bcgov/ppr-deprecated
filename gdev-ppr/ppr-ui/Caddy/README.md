# Client UI Caddy

> Caddy configuration

This folder contains the Caddy web server configuration for the PPR UI application. This configuration is copied into
the build image during the build stage.

To run a local version of caddy you may:
```bash
npm run build
docker-compose -f d-c.yml up
``` 
Then connect to ```http://localhost:2015```

