# Approved Python application plan

Estimated Time: 10 minutes to review locally.

### Objectives

Agree the app behavior and test evidence before coding. No invented schema, rows or measures.

## Purpose and scope

* App name and audience: [customer terminology]
* Business decision supported: [specific outcome]
* In scope: [two approved questions]
* Out of scope: [writes, arbitrary SQL, public hosting, unsupported questions]

## Report catalog contract

| Report ID | Question answered | Source objects/columns | Measure and grain | Filters, units and nulls | Independent check |
| --- | --- | --- | --- | --- | --- |
| [report_one] | [question] | [verified metadata] | [approved definition] | [exact rules] | [trusted SQL/evidence] |
| [report_two] | [question] | [verified metadata] | [approved definition] | [exact rules] | [trusted SQL/evidence] |

## Screens and agent behavior

* Header and report labels: [customer wording].
* First useful table/chart: [report, axes, units, sort, empty state].
* Second useful table/chart: [report, axes, units, sort, empty state].
* Question input → report-ID tool → bounded database result → answer with source.
* Unsupported question: explain scope and ask for an approved report.
* Errors: redact connection details; never fabricate fallback data.

## Build and acceptance plan

* First milestone: preflight database connection and connectivity report.
* Second milestone: reviewed customer catalog, verified SQL and customer screens.
* Third milestone: bounded agent loop and visible tool activity.
* Required tests: offline contracts plus Lab 7 live acceptance matrix.
* Runtime provider/model access and result-sharing approval: [local reference].
* Open questions and approval: [resolve before building].

## Acknowledgements

* Complete locally with your data owner; keep out of the public workshop repository.
