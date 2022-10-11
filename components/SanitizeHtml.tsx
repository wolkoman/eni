import React from 'react';
import sanitize from 'sanitize-html';

export const sanitizeRawOptions = { allowedTags: []};
export const sanitizeOptions = { allowedTags: ['u', 'b', 'a', 'br', 'h1', 'h2', 'h3', 'p', 'strong'], allowedAttributes: {a: ['href']}};
export const SanitizeHTML = ({ html }: {html: string}) => (
  <div dangerouslySetInnerHTML={{__html: sanitize(html, sanitizeOptions)}} className="custom-html" />
);