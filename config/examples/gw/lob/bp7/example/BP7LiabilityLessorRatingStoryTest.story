Meta: 
@Jira PC-21858
Scenario: Calculate premium for liability coverage for lessor

Given a basic submission with <n> classifications
And each occurence limit is <each_occur_limit>
And product completed ops aggregate limit is <prod_agg_limit>
And general aggregate limit is <gen_agg_limit>
And property type is <property_type>
And Building limit is <building_limit>
And all classification descriptions are <class_description>
When we quote
Then the liability lessor premium is <liab_premium>

Examples:
 |n |each_occur_limit |prod_agg_limit |gen_agg_limit |property_type |building_limit |class_description                         |liab_premium |
 |2 |500000           |1000000        |1000000       |Contractor    |100000         |Carpentry-Interior-Office                 |65           |
 |1 |500000           |1000000        |1000000       |Contractor    |100000         |Carpentry-Interior-Office                 |65           |
 |1 |500000           |1000000        |1000000       |Office        |100000         |Accounting Services-CPAs-Lessor Risk Only |57           |
 |1 |1000000          |3000000        |2000000       |Office        |100000         |Accounting Services-CPAs-Lessor Risk Only |59           |
