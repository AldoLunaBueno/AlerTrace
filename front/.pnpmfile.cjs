// Configuración personalizada para pnpm
module.exports = {
  hooks: {
    readPackage(pkg) {
      // Configuraciones específicas para el proyecto
      if (pkg.name === '@sachatrace/frontend') {
        // Asegurar que las dependencias de peer se instalen automáticamente
        pkg.peerDependenciesMeta = {
          ...pkg.peerDependenciesMeta,
          react: { optional: true },
          'react-dom': { optional: true }
        }
      }
      return pkg
    }
  }
}
