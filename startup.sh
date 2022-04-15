#!/bin/bash

# Recreate config file
rm -rf ./static/env-config.js
touch ./static/env-config.js

# Add assignment
echo "window._env_ = {" >> ./static/env-config.js

# Append configuration property to JS file
echo "  EXTERNAL_IP: \"$EXTERNAL_IP\"," >> ./static/env-config.js

echo "}" >> ./static/env-config.js

cat ./static/env-config.js

ls -al

ls -al ./static/

ls -al ./static/images/

exec java $JAVA_OPTS -jar app.jar