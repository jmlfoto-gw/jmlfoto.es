# jmlfoto · Web personal Jose Morales
## Guía de estructura, archivos e instrucciones

---

## Estructura completa de carpetas

```
jmlfoto-web/
│
├── index.html              ← Página principal
├── style.css               ← Estilos
├── script.js               ← Interacciones
├── cookies.js              ← Gestión de consentimiento de cookies y GA4
├── privacidad.html         ← Política de privacidad
├── aviso-legal.html        ← Aviso legal
├── README.md               ← Esta guía
│
└── assets/
    └── img/
        │
        │── HERO (slideshow)
        ├── hero-01.jpg          1920×1080 px · Concierto, Vincent de Gwendal
        ├── hero-02.jpg          1920×1080 px · Naturaleza, seta
        ├── hero-03.jpg          1920×1080 px · Retrato de Ángela
        ├── hero-04.jpg          1920×1080 px · Modelo en campo de lavanda
        │
        │── SOBRE MÍ
        ├── retrato.jpg          600×800 px  · Foto vertical (Ortigueira)
        │
        │── PORTFOLIO
        ├── portfolio-conciertos.jpg   800×600 px · Horizontal
        ├── portfolio-naturaleza.jpg   800×600 px · Horizontal
        ├── portfolio-patrimonio.jpg   800×600 px · Horizontal
        ├── portfolio-dron.jpg         800×600 px · Horizontal
        │
        │── PROYECTO GWENDAL
        ├── proyecto-gwendal.jpg       800×1000 px · Vertical
        │
        │── BLOG (actualizar con cada nueva entrada)
        ├── blog-01.jpg          600×400 px · Entrada más reciente
        ├── blog-02.jpg          600×400 px · Segunda entrada
        ├── blog-03.jpg          600×400 px · Tercera entrada
        │
        │── COPIAS
        ├── copias.jpg           800×1000 px · Vertical
        │
        └── REDES SOCIALES
            og-jmlfoto.jpg       1200×630 px · Preview al compartir en redes
```

---

## Cómo publicar en GitHub Pages

1. Crea un repositorio en GitHub
2. Sube todos los archivos manteniendo esta estructura de carpetas
3. Ve a **Settings → Pages**
4. En Branch selecciona `main` y carpeta `/ (root)`
5. Clic en **Save**
6. Dominio definitivo: `https://jmlfoto.es`

---

## Scripts de carga — orden obligatorio

Al final del `<body>`, justo antes de `</body>`, los scripts deben ir siempre en este orden:

```html
<script src="cookies.js"></script>
<script src="script.js"></script>
```

Nunca invertir el orden ni duplicar ninguno de los dos.

---

## Google Tag Manager y Google Analytics 4

### ID de cuenta
- **GTM:** `GTM-TDFDLBF4`
- **GA4:** `G-N0SML98Z05`

### Fragmento 1 — en el `<head>`, justo después de `<meta charset>`

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TDFDLBF4');</script>
<!-- End Google Tag Manager -->
```

### Fragmento 2 — primera línea dentro del `<body>`

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TDFDLBF4"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

Ambos fragmentos van en los tres archivos: `index.html`, `privacidad.html` y `aviso-legal.html`.

---

## Sistema de cookies y consentimiento (cookies.js)

El archivo `cookies.js` gestiona el consentimiento RGPD y la carga condicional de Google Analytics 4.

**Comportamiento:**
- Primera visita: aparece un banner en la parte inferior con dos opciones — botón **Aceptar** (carga GA4) y botón **✕** (cierra sin activar analítica).
- La elección se guarda en una cookie propia (`jmlfoto_cookies`) durante 365 días.
- En visitas siguientes no vuelve a aparecer y aplica la preferencia guardada automáticamente.
- Si el visitante rechaza, GA4 no carga en ningún momento y se eliminan sus cookies si ya existían.

**Para modificar el texto del banner** abre `cookies.js` y edita el bloque `banner.innerHTML`.

---

## SEO — configuración actual

### Dominio canonical
Todos los meta canónicos, Open Graph y Schema.org apuntan a `https://jmlfoto.es/`. No usar la URL de GitHub Pages en ninguna etiqueta SEO.

### Imagen Open Graph
Archivo: `assets/img/og-jmlfoto.jpg`
Medidas obligatorias: **1200 × 630 px**, formato JPG, peso inferior a 300 KB.
Es la imagen que aparece al compartir la web en redes sociales y WhatsApp.
Verificar previsualización en: https://developers.facebook.com/tools/debug

### Estructura SEO en el `<head>`

```html
<title>Jose Morales · jmlfoto · Fotógrafo de Conciertos, Naturaleza y Patrimonio · Madrid</title>
<meta name="description" content="Fotógrafo profesional en Madrid especializado en conciertos, naturaleza, patrimonio histórico y proyectos documentales. Autor del libro Gwendal, 50 años de música celta." />
<meta name="author" content="Jose Morales · jmlfoto" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://jmlfoto.es/" />
```

---

## Cómo añadir imágenes reales

### Imagen del proyecto Gwendal
La imagen va dentro de `.proy-img`. Para que sea visible hay que asegurarse de que el `<img>` tiene `position: relative` y `z-index: 1` para quedar por encima del pseudoelemento `::before` del contenedor placeholder. Añadir en `style.css`:

```css
.img-ph img {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-ph:has(img)::before {
  display: none;
}
```

### Portfolio
Busca cada `.port-img` en `index.html` y sustituye el placeholder:

```html
<!-- Antes -->
<div class="img-ph">...</div>

<!-- Después -->
<img src="assets/img/portfolio-conciertos.jpg"
     alt="Fotografía de conciertos"
     loading="lazy" />
```

Añadir en `style.css`:

```css
.port-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--t-slow);
}
.port-item:hover .port-img img { transform: scale(1.04); }
```

### Blog
Busca cada `.blog-img` y sustituye el placeholder. Las imágenes del blog estaban definidas como texto dentro de un `<span>` — hay que reemplazar el bloque entero:

```html
<!-- Antes (placeholder incorrecto) -->
<div class="blog-img">
  <div class="img-ph" aria-hidden="true">
    <span>assets/img/blog-01.jpg</span>
  </div>
</div>

<!-- Después (imagen real) -->
<div class="blog-img">
  <img src="assets/img/blog-01.jpg"
       alt="Título de la entrada"
       loading="lazy" />
</div>
```

Añadir en `style.css`:

```css
.blog-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--t-slow);
}
.blog-link:hover .blog-img img { transform: scale(1.05); }
```

---

## Cómo actualizar el blog

Cada vez que publiques una entrada nueva en WordPress:

1. Abre `index.html`
2. Busca `<div class="blog-lista">`
3. Copia un `<article class="blog-item">` existente
4. Pégalo al principio de la lista (será la entrada más reciente)
5. Actualiza estos datos:

```html
<article class="blog-item reveal">
  <a href="https://jmlfoto.es/TU-NUEVA-URL"
     target="_blank" rel="noopener noreferrer">
    <div class="blog-img">
      <img src="assets/img/blog-01.jpg"
           alt="Título de la entrada"
           loading="lazy" />
    </div>
    <div class="blog-body">
      <span class="blog-cat">Conciertos</span>
      <time datetime="2026-06-01">1 junio 2026</time>
      <h3>Título de la entrada</h3>
      <p>Extracto breve...</p>
    </div>
  </a>
</article>
```

6. Elimina el `<article>` más antiguo para mantener solo 3 entradas visibles
7. Sube `index.html` y la imagen nueva a GitHub

---

## Formulario de contacto

Conectado a Formspree. Para cambiar el destinatario:
1. Entra en https://formspree.io
2. Crea o edita el formulario `Contacto jmlfoto`
3. En `index.html` busca `action="https://formspree.io/f/mlgkekrd"`
4. Sustitúyelo por tu nuevo código de formulario

---

## Páginas legales

| Archivo | Contenido |
|---|---|
| `privacidad.html` | Política de privacidad — 10 artículos. Cubre RGPD, Formspree, GA4, derechos del usuario y cookies. |
| `aviso-legal.html` | Aviso legal — 8 artículos. Cubre LSSICE, propiedad intelectual de las fotografías y plataforma Saal Digital. |

Ambas páginas comparten el mismo sistema de diseño que `index.html` y deben incluir también los fragmentos de Google Tag Manager y el script `cookies.js`.

---

## Datos a personalizar

| Qué | Dónde buscarlo |
|---|---|
| Email de contacto | `href="mailto:jose@jmlfoto.es"` |
| URL Instagram | `href="https://www.instagram.com/jmlfoto"` |
| URL Facebook | `href="https://www.facebook.com/jmlfoto"` |
| URL Twitter/X | `href="https://twitter.com/jmlfoto"` |
| URL YouTube | `href="https://www.youtube.com/@jmlfoto-es"` |
| URL tienda copias (Saal Digital) | `href="https://photo-portal.shop/profiles/jmlfoto/..."` |
| URL web Gwendal | `href="https://jmlfoto-gw.github.io/gwendalceltic/"` |
| Canonical y og:url | En el `<head>` de los tres HTML — siempre `https://jmlfoto.es/` |

---

## Compatibilidad

- Chrome / Edge 88+
- Firefox 85+
- Safari 14+
- iOS Safari · Chrome Android
- Sin dependencias externas salvo Google Fonts y Google Tag Manager
