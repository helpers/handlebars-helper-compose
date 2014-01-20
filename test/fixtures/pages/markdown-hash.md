---
layout: vanilla
title: Markdown
description: Should process markdown using options
---

<div class="docs-section">
  <div class="page-header">
    <h1 id="{{slugify title}}">{{{title}}}</h1>
  </div>
  <p class="description">{{{description}}}</p>
</div>


<!-- post -->
{{#compose src="<%= config.posts %>/markdown.md" markdown="true"}}
  <a class="anchor" href="#{{@id}}"></a>
  <h3 class="post-title" id="{{@slug}}">{{title}}</h3>
  <p class="post-content">
    {{{@content}}}
  </p>
  <ul class="tags">
  {{#tags}}
    <li>{{.}}</li>
  {{/tags}}
  </ul>
{{/compose}}