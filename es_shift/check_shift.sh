#!/bin/bash

# Routes
SCRIPT_PATH="/media/erwin/CRITERIA/Programming/projects/personal/turno-residencia/main.js"
LOG_PATH="/home/erwin/logs/turno_log.txt"

# exe
echo "Ejecución: $(date)" >> "$LOG_PATH"
node "$SCRIPT_PATH" >> "$LOG_PATH" 2>&1

# Verify
if [ $? -eq 0 ]; then
    notify-send "Ejecución exitosa" "El script de Node.js se ejecutó correctamente."
else
    notify-send "Error en la ejecución" "Hubo un error al ejecutar el script de Node.js. Consulta el archivo de log para más detalles."
fi

# add crontab -e every 15 mins 