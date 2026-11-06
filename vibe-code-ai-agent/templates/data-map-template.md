# Verified customer data map

Estimated Time: 10 minutes to review locally.

### Objectives

Distinguish discovered metadata from customer-confirmed business meaning. Replace this template with only approved metadata; never add secrets or raw samples.

## Verified objects

| Owner.object | Table/view | Row grain | Metadata completeness | Data-owner approval |
| --- | --- | --- | --- | --- |
| [verified object] | [type] | [confirmed meaning of one row] | [complete or remaining pages] | [status] |

## Fields and business definitions

| Object.column | Oracle type / nullable | Meaning | Units/timezone/null handling | Model-visible? | Evidence |
| --- | --- | --- | --- | --- | --- |
| [verified field] | [observed metadata] | [confirmed or unknown] | [definition] | [yes/no] | [dictionary or owner confirmation] |

## Keys and joins

| Relationship | Declared or proposed | Column positions | Cardinality | Multiplication check | Owner approval |
| --- | --- | --- | --- | --- | --- |
| [relationship, or none needed] | [evidence] | [including composite key positions] | [verified/unknown] | [check] | [status] |

## Question-to-data mapping

* Question 1 → [objects, columns, aggregation, filters, evidence check].
* Question 2 → [objects, columns, aggregation, filters, evidence check].
* Unknowns and blockers: [facts requiring confirmation].
* Excluded fields and joins: [explicit list].

## Acknowledgements

* Complete locally with your data owner; keep out of the public workshop repository.
