// syntax-highlight.component.ts
import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from "@angular/core";
import * as Prism from "prismjs";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.js";
import "prismjs/components/prism-csharp.min.js";
import "prismjs/components/prism-typescript.min.js";

@Component({
  selector: "app-syntax-highlight",
  templateUrl: "./syntax-highlight.component.html",
  styleUrls: ["./syntax-highlight.component.less"],
})
export class SyntaxHighLightComponent implements AfterViewInit, OnInit {
  @Input() title: string = "";
  @Input() code: string = "";
  @Input() language: string = "html";
  @Input() size: string = "";
  copyButtonText: string = "Copy";
  htmlSnippet: string;
  isCopied: boolean;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    //this.highlightCode();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes["code"] && changes["code"].currentValue !== changes["code"].previousValue) ||
      (changes["language"] && changes["language"].currentValue !== changes["language"].previousValue)
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
    if (this.code) {
      let language = this.language || "html";
      this.htmlSnippet = Prism.highlight("\r\n" + this.code, Prism.languages[language], language);
    }
  }

  /**
   * 将代码复制到剪贴板
   */
  copyToClipboard() {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = this.code;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    navigator.clipboard
      .writeText(tempTextArea.value)
      .then(() => {
        this.copyButtonText = "Copied!";
        this.isCopied = true;
        setTimeout(() => {
          this.copyButtonText = "Copy";
          this.isCopied = false;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
    document.body.removeChild(tempTextArea);
  }
}
