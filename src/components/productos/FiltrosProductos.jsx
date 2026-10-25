import { useState } from 'react';
import { contarFiltrosActivos, rangoValido } from '../../utils/filtros';
import { formatoCLP } from '../../utils/formato';

const OPCIONES_ORDEN = [
  { valor: '', etiqueta: 'Relevancia' },
  { valor: 'precio-asc', etiqueta: 'Precio: menor a mayor' },
  { valor: 'precio-desc', etiqueta: 'Precio: mayor a menor' },
  { valor: 'nombre', etiqueta: 'Nombre (A-Z)' },
];

function Chip({ texto, etiquetaQuitar, onQuitar }) {
  return (
    <span className="badge rounded-pill text-bg-light border d-inline-flex align-items-center gap-2 fw-normal">
      {texto}
      <button type="button" className="btn-close" style={{ fontSize: '0.55rem' }} aria-label={etiquetaQuitar} onClick={onQuitar} />
    </span>
  );
}

export default function FiltrosProductos({ filtros, categorias, mostrados, total, onCambiar, onLimpiar }) {
  const [abierto, setAbierto] = useState(false);
  const activos = contarFiltrosActivos(filtros);
  const rangoInvalido = !rangoValido(filtros.min, filtros.max);

  const cambiar = (e) => onCambiar({ [e.target.name]: e.target.value });

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex gap-2">
          <div className="input-group flex-grow-1">
            <span className="input-group-text bg-white"><i className="bi bi-search" /></span>
            <input
              type="search"
              name="texto"
              className="form-control"
              placeholder="Buscar por nombre…"
              aria-label="Buscar por nombre"
              value={filtros.texto}
              onChange={cambiar}
            />
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary d-md-none"
            aria-expanded={abierto}
            aria-controls="panelFiltros"
            onClick={() => setAbierto(!abierto)}
          >
            <i className="bi bi-funnel me-1" />Filtros
            {activos > 0 && <span className="badge text-bg-primary ms-1">{activos}</span>}
          </button>
        </div>

        <div id="panelFiltros" className={`collapse d-md-block ${abierto ? 'show' : ''}`}>
          <div className="row g-3 mt-0">
            <div className="col-md-3">
              <label htmlFor="filtroCategoria" className="form-label small fw-semibold mb-1">Categoría</label>
              <select id="filtroCategoria" name="categoria" className="form-select" value={filtros.categoria} onChange={cambiar}>
                <option value="">Todas las categorías</option>
                {categorias.map((c) => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
            </div>

            <div className="col-md-5">
              <span className="form-label small fw-semibold mb-1 d-block">Rango de precio</span>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input type="number" min="0" step="1000" name="min" className={`form-control ${rangoInvalido ? 'is-invalid' : ''}`}
                  placeholder="Mínimo" aria-label="Precio mínimo" value={filtros.min} onChange={cambiar} />
                <span className="input-group-text">a</span>
                <input type="number" min="0" step="1000" name="max" className={`form-control ${rangoInvalido ? 'is-invalid' : ''}`}
                  placeholder="Máximo" aria-label="Precio máximo" value={filtros.max} onChange={cambiar} />
              </div>
              {rangoInvalido && <div className="text-danger small mt-1">El mínimo no puede ser mayor que el máximo.</div>}
            </div>

            <div className="col-md-2">
              <label htmlFor="filtroOrden" className="form-label small fw-semibold mb-1">Ordenar por</label>
              <select id="filtroOrden" name="orden" className="form-select" value={filtros.orden} onChange={cambiar}>
                {OPCIONES_ORDEN.map((o) => <option key={o.valor} value={o.valor}>{o.etiqueta}</option>)}
              </select>
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button type="button" className="btn btn-outline-secondary w-100" disabled={activos === 0 && !filtros.orden} onClick={onLimpiar}>
                <i className="bi bi-x-circle me-1" />Limpiar
              </button>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
          <span className="text-muted small">{`Mostrando ${mostrados} de ${total} productos`}</span>
          {filtros.texto.trim() && <Chip texto={`Nombre: “${filtros.texto.trim()}”`} etiquetaQuitar="Quitar filtro de texto" onQuitar={() => onCambiar({ texto: '' })} />}
          {filtros.categoria && <Chip texto={`Categoría: ${filtros.categoria}`} etiquetaQuitar="Quitar filtro de categoría" onQuitar={() => onCambiar({ categoria: '' })} />}
          {filtros.min !== '' && <Chip texto={`Desde ${formatoCLP(filtros.min)}`} etiquetaQuitar="Quitar precio mínimo" onQuitar={() => onCambiar({ min: '' })} />}
          {filtros.max !== '' && <Chip texto={`Hasta ${formatoCLP(filtros.max)}`} etiquetaQuitar="Quitar precio máximo" onQuitar={() => onCambiar({ max: '' })} />}
        </div>
      </div>
    </div>
  );
}
