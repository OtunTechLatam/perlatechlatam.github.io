# Cambio recomendado en pages/diagnostico.html

Busca este bloque actual del formulario:

```html
<label>Inversión estimada (opcional)
  <select name="budget">
    <option>Por definir</option>
    <option>Menos de $500.000 CLP</option>
    <option>$500.000 a $1.500.000 CLP</option>
    <option>Más de $1.500.000 CLP</option>
  </select>
</label>
```

Reemplázalo por:

```html
<label>¿Tu organización ya tiene un presupuesto definido para esta iniciativa?
  <select name="budget">
    <option value="Por definir">Todavía no</option>
    <option>Estamos evaluándolo</option>
    <option>Existe un presupuesto aproximado</option>
    <option>Existe un presupuesto aprobado</option>
    <option>Prefiero conversarlo</option>
  </select>
</label>
```

Motivo: evita anclar todos los proyectos a montos pequeños y permite calificar oportunidades de distinto tamaño sin excluirlas.
