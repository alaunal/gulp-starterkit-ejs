window.addEventListener('load', () => {
    const modules = document.querySelectorAll('[data-module]');

    modules.forEach(node => {
      let moduleName = node.dataset.module;

      switch (moduleName) {
        case 'page-404':
          import('./modules/page404')
          .then((module) => {
            module.default();
          });
          break;

        default:
          console.log('module not found!');
          break;
      }
    });
});
