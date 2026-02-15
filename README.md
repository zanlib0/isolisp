# isolisp - Lisp for full-stack forms

Idea behind this app: test the viability of a small Lisp-based DSL with an interpreter written in JS to be used for defining business logic on the backend as a single source of truth. Specify validations and policies as a simple Lisp code that can be later evaluated on the backend or frontend. The code works across languages as long as the interpreter can be implemented in that language (in this repo we are using JS for both for simplicity, but this could also work in a, say, Elixir backend and React frontend).

Example domain: complex onboarding for a HRIS/payroll system that works across different countries and legal systems. ~50 different legal systems, with potentially very complex rules for onboarding users.

First test: check if user is Polish citizen and uses national identity document for onboarding, if yes, use the DSL to validate PESEL.

Domain challenges:

- rules change often (new fields, different validations)
- different UIs (forms, details, lists)
- multiple platforms (web, mobile, API)
- release process (multiple deploys, version control)

Use cases:

- Forms: the most basic use case, when inputting data on the frontend we can generate a form from the definition. The frontend validation ensures that the user receives immediate feedback about any possible issues.
- Details box: displays the submitted values for a specific entity. We can't guarantee data consistency (because e.g. laws or policies can change after the user had submitted the form), so we should also display any errors in the details box based on the rules.
- Tables: multiple users can submit data and also in a table we should highlight cells which are incorrect if the rules change.

Prior art:

- JSON schema - can be used for full stack validation. Widely supported across runtimes and environments. You can use conditionals for logic, but they are very verbose.
- Existing JSON schema tooling - most of the tooling is "stuck to a stack," the tooling that you need is most likely not available if you have specific needs.
- JsonLogic - similar to Lisp, the limitation is that there is one env. With our evaluator, we could have separate envs, for example `{s: "symbol"}` values are looked up in the normal environment, but we could also have `{v: "symbol"}` which looks up in the current form values.
- Open Policy Agent and Rego language - can be used for policy-based authentication and validation.
- [Full-stack forms with JSON schemas](https://www.youtube.com/watch?v=UWI1rEr2yyg) by Sandrina Pereira

Challenges:

- Debugging and linting
- Duplication: macros, inclusions via normal host language variables.
- Runtime access
