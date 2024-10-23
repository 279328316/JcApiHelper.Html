import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from "./app/app.module";

import 'prismjs';
import 'prismjs/plugins/line-numbers/prism-line-numbers.min.js';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err) => console.error(err));
