import { FILTROS_INICIALES, contarFiltrosActivos, filtrarProductos, normalizar, rangoValido } from '../../src/utils/filtros';

describe('utils/filtros', () => {
  const productos = [
    { id: 1, nombre: 'Zapatillas de Ballet', categoria: 'Calzado', precio: 35000 },
    { id: 2, nombre: 'Malla de Danza Elástica', categoria: 'Vestuario', precio: 22000 },
    { id: 3, nombre: 'Toalla Microfibra', categoria: 'Accesorios', precio: 12000 },
    { id: 4, nombre: 'Zapatos de Salsa', categoria: 'Calzado', precio: 45000 },
  ];
  const filtrar = (cambios) => filtrarProductos(productos, { ...FILTROS_INICIALES, ...cambios }).map((p) => p.id);

  it('sin filtros devuelve todos los productos en su orden original', () => {
    expect(filtrar({})).toEqual([1, 2, 3, 4]);
  });

  it('normalizar quita tildes, mayúsculas y espacios de los bordes', () => {
    expect(normalizar('  ELÁSTICA ')).toBe('elastica');
  });

  it('busca por nombre sin distinguir mayúsculas ni tildes', () => {
    expect(filtrar({ texto: 'elastica' })).toEqual([2]);
    expect(filtrar({ texto: 'ZAPAT' })).toEqual([1, 4]);
  });

  it('filtra por categoría', () => {
    expect(filtrar({ categoria: 'Calzado' })).toEqual([1, 4]);
  });

  it('filtra por precio mínimo, máximo y rango', () => {
    expect(filtrar({ min: '30000' })).toEqual([1, 4]);
    expect(filtrar({ max: '22000' })).toEqual([2, 3]);
    expect(filtrar({ min: '20000', max: '40000' })).toEqual([1, 2]);
  });

  it('el rango es inclusivo en ambos extremos', () => {
    expect(filtrar({ min: '22000', max: '35000' })).toEqual([1, 2]);
  });

  it('un rango invertido se ignora en vez de ocultar todo', () => {
    expect(rangoValido('50000', '10000')).toBe(false);
    expect(filtrar({ min: '50000', max: '10000' })).toEqual([1, 2, 3, 4]);
  });

  it('combina texto, categoría y precio', () => {
    expect(filtrar({ texto: 'zapat', categoria: 'Calzado', max: '40000' })).toEqual([1]);
  });

  it('ordena por precio y por nombre', () => {
    expect(filtrar({ orden: 'precio-asc' })).toEqual([3, 2, 1, 4]);
    expect(filtrar({ orden: 'precio-desc' })).toEqual([4, 1, 2, 3]);
    expect(filtrar({ orden: 'nombre' })).toEqual([2, 3, 1, 4]);
  });

  it('no modifica el arreglo original al ordenar', () => {
    filtrar({ orden: 'precio-desc' });
    expect(productos.map((p) => p.id)).toEqual([1, 2, 3, 4]);
  });

  it('contarFiltrosActivos cuenta texto, categoría, mínimo y máximo (no el orden)', () => {
    expect(contarFiltrosActivos(FILTROS_INICIALES)).toBe(0);
    expect(contarFiltrosActivos({ texto: ' ', categoria: 'Calzado', min: '1000', max: '', orden: 'nombre' })).toBe(2);
  });
});
