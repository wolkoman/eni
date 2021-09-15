import React from 'react';
import sanitize from 'sanitize-html';

export const SanitizeHTML = ({ html }: {html: string}) => (
  <div dangerouslySetInnerHTML={{__html: sanitize(html ,{allowedTags: ['u', 'b', 'a', 'br'], allowedAttributes: {a: ['href']}})}} className="custom-html" />
);