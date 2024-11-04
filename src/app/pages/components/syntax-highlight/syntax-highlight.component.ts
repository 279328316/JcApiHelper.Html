// syntax-highlight.component.ts
import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as Prism from 'prismjs';

import prettier from 'prettier/standalone';
import prettierPluginHtml from 'prettier/plugins/html';
import prettierPluginTypescript from 'prettier/plugins/typescript';
import prettierPluginBabel from 'prettier/plugins/babel';

import 'prismjs/plugins/line-numbers/prism-line-numbers.min.js';
import 'prismjs/components/prism-csharp.min.js';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/components/prism-less.min.js';
import 'prettier/plugins/html.js';
import 'prettier/plugins/typescript.js';

@Component({
  selector: 'app-syntax-highlight',
  templateUrl: './syntax-highlight.component.html',
  styleUrls: ['./syntax-highlight.component.less'],
})
export class SyntaxHighLightComponent implements AfterViewInit, OnInit {
  @Input() title: string = '';
  @Input() code: string = '';
  @Input() language: string = 'html';
  @Input() size: string = '';
  copyButtonText: string = 'Copy';
  htmlSnippet: string;
  isCopied: boolean;
  languages = {
    html: 'html',
    less: 'less',
    typescript: 'typescript',
    csharp: 'csharp',
  };

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    //this.highlightCode();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes['code'] && changes['code'].currentValue !== changes['code'].previousValue) ||
      (changes['language'] && changes['language'].currentValue !== changes['language'].previousValue)
    ) {
      this.highlightCode();
    }
  }

  /**
   * 高亮代码
   *
   * @returns 无返回值
   */
  highlightCode() {
    let language = this.languages[this.language] || this.languages.html;
    //let prettierCode = await this.prettyCode(this.code, language);
    //console.log(this.code, prettierCode);
    console.log('highlightCode', this.language, language);
    this.htmlSnippet = Prism.highlight('\r\n' + this.code, Prism.languages[language], language);
  }

  async prettyCode(code: string, language: string): Promise<string> {
    let prettierCode = code;
    let parsers = {
      html: 'html',
      ts: 'typescript',
      csharp: 'typescript', // 注意：Prettier 默认没有 C# 解析器，这里使用了 Babel 作为替代，实际使用时需要根据实际情况调整
    };
    const parser = parsers[language] || parsers.html;
    try {
      const formatted = await prettier.format(code, {
        parser: parser,
        plugins: [prettierPluginHtml, prettierPluginTypescript, prettierPluginBabel], // 根据需要添加
        semi: false,
        trailingComma: 'all',
        singleQuote: false,
        printWidth: 120,
        tabWidth: 2,
      });
      prettierCode = formatted;
    } catch (error) {
      console.error('Error formatting code:', error);
    }
    return prettierCode;
  }

  /**
   * 将代码复制到剪贴板
   */
  copyToClipboard() {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = this.code;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    navigator.clipboard
      .writeText(tempTextArea.value)
      .then(() => {
        this.copyButtonText = 'Copied!';
        this.isCopied = true;
        setTimeout(() => {
          this.copyButtonText = 'Copy';
          this.isCopied = false;
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
    document.body.removeChild(tempTextArea);
  }
}
