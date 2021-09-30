import React from 'react';
import sanitize from 'sanitize-html';

export const SanitizeHTML = ({ html }: {html: string}) => (
  <div dangerouslySetInnerHTML={{__html: sanitize(html ,{allowedTags: ['u', 'b', 'a', 'br', 'h1', 'h2', 'h3', 'p', 'strong'], allowedAttributes: {a: ['href']}})}} className="custom-html" />
);