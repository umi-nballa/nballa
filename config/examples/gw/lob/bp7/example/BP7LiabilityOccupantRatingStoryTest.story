Meta: 
@Jira PC-21858
Scenario: Calculate premium for liability coverage for occupant

Given a basic submission with <n> classifications
And each occurence limit is 500000
And product completed ops aggregate limit is 1000000
And general aggregate limit is 1000000
And property type is <property_type>
And percentage owner occupied is >10
And all classification descriptions are <class_description>
And the classification BPP limits are <bpp_limits>
And all classification has FV limit <fv_limit>
And all classification liability exposures are <liab_exposure>
When we quote
Then the liability occupant premiums are <liab_premiums>

Examples:
 |n |property_type |class_description                           |bpp_limits   |fv_limit |liab_exposure |liab_premiums |
 |2 |Contractor    |Carpentry-Interior-Office                   |10000, 10000 |0        |5000000       |84700, 84700  |
 |2 |Contractor    |Carpentry-Interior-Office                   |10000, 10000 |5000     |5000000       |84700, 84700  |
 |1 |Office        |Accounting Services-CPAs                    |10000        |5000     |1             |33            |
 |1 |Office        |Accounting Services-CPAs                    |10000        |0        |1             |22            |
 |2 |Office        |Accounting Services-CPAs                    |10000, 0     |0        |1             |22            |
 |2 |Contractor    |Carpentry-Interior-Office                   |10000, 0     |0        |5000000       |84700         |
 |1 |Apartment     |Boarding Houses/Rooms, Merc or Office Occup |10000        |0        |1             |              |
