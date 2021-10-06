import NextDocument, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';

export default class Document extends NextDocument {
  static getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    return NextDocument.getInitialProps(ctx);
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" href="/favicon.png" />
          <meta charSet="UTF-8" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
