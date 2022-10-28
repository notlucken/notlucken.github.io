var store = [{
        "title": "Tratamiento de la TTY",
        "excerpt":" ","categories": ["Tecnicas"],
        "tags": ["tty","Bash","Trabajo"],
        "url": "http://localhost:4000/Tratamiento-de-la-TTY/",
        "teaser":"http://localhost:4000/assets/images/tratamientoTTY/logo.png"},{
        "title": "ICA 1 - VulnHub Writeup",
        "excerpt":"ICA: 1 Writeup by notlucken Reconocimiento de Servicios expuestos Primero como siempre, tiro de nmap, con los argumentos nmap -p- --open -sS --min-rate 5000 -Pn -n 192.168.100.116 y luego a los puertos abiertos les aplico un nmap -p22,80,3306,33060 -sCV 192.168.100.116. Este es el resultado del segundo escaneo: PORT STATE SERVICE...","categories": ["Tecnicas"],
        "tags": ["Pivoting","Bash","Herramientas"],
        "url": "http://localhost:4000/ICA1-Writeup/",
        "teaser":"http://localhost:4000/assets/images/ICA/logo.png"},{
        "title": "Laboratorio de Pivoting - Symfonos 1,3,5",
        "excerpt":"Yo me monté una red de 3 máquinas con 2 redes internas, para poder solo tener acceso a Symfonos 1 e ir pivoteando para ganar acceso a la máquina final que sería Symfonos 5. Symfonos 1 Enumeración Comenzamos con la Symfonos 1: Ahí vemos que tiene redireccionamiento DNS, a symfonos.local,...","categories": ["Tecnicas"],
        "tags": ["Pivoting","Bash","Herramientas"],
        "url": "http://localhost:4000/Laboratorio-de-Pivoting/",
        "teaser":"http://localhost:4000/assets/images/labPivoting/Symfonos.png"},{
        "title": "Chmod - Privilege Escalation",
        "excerpt":"Si vemos que el usuario que estamos usando, puede ejecutar chmod como sudo, lo que habría que hacer sería lo siguiente:   sudo -u root chmod 4577 /bin/bash      luego solo habría que hacer un bash -p      ","categories": ["Tecnicas"],
        "tags": ["Escalada de Privilegios","Sudo"],
        "url": "http://localhost:4000/chmod-privilege-escalation/",
        "teaser":"http://localhost:4000/assets/images/chmodPrivilege/logo.png"},{
        "title": "Perl Cap - Privilege Escalation",
        "excerpt":"Para saber si la máquina es vulnerable a esto, hay que realizar lo siguiente:      perl cap_setuid+ep   Entonces lo que hacemos es:      ","categories": ["Escalada de Privilegios"],
        "tags": ["Perl"],
        "url": "http://localhost:4000/perl-cap-setuid-privilege-escalation/",
        "teaser":"http://localhost:4000/assets/images/perl/logo.jpeg"},{
        "title": "Dirty Pipe - CVE-2022-0847",
        "excerpt":"Dirty Pipe Vulnerability Dirty Pipe (CVE-2022-0847) es una vulnerabilidad en el Kernel de Linux que permite a los usuarios no privilegiados modificar archivos de solo lectura y obtener una shell con privilegios. Versiones afectadas Las versiones de Kernel de Linux que son afectadas son las siguentes: 5.8 -&gt; 5.16.10 5.15.24...","categories": ["Tecnicas"],
        "tags": ["Escalada de Privilegios","Kernel"],
        "url": "http://localhost:4000/Dirty-Pipe/",
        "teaser":"http://localhost:4000/assets/images/dirtyP/logo.png"},{
        "title": "PwnKit - Privilege Escalation",
        "excerpt":"PwnKit Vulnerability PwnKit es una vulnerabilidad de correcion de memoria en pkexec de Polkit, que le permite a algun usuario sin privilegios convertirse en Root.. Polkit es el software que se encarga de controlar los privilegios de sistema en sistemas basados en Unix. Es un programa SUID instalado en todas...","categories": ["Escalada de Privilegios"],
        "tags": ["pkexec","SUID"],
        "url": "http://localhost:4000/pwnKit-privilege-escalation/",
        "teaser":"http://localhost:4000/assets/images/pwnKit/logo.png"},{
        "title": "Python Library Privilege Escalation",
        "excerpt":"Primero hay que localizar un Script que el dueño sea root: ![[Pasted image 20221025202417.png]] Luego al entrar a ese script, veremos que se utiliza alguna librería, y deberemos buscarla en /usr/lib/python… ![[Pasted image 20221025202505.png]] Entonces, ahora en la librería lo que tenemos que poner es lo siguiente: import os os.system(“chmod...","categories": [],
        "tags": [],
        "url": "http://localhost:4000/python-library-privilege-escalation/",
        "teaser":null}]
