Meta: 
@Jira PC-21858
Scenario: Calculate premium for liability coverage for lessor when the policy has IRPM factors

Given a basic submission with 1 classifications
And each occurence limit is 500000
And product completed ops aggregate limit is 1000000
And general aggregate limit is 1000000
And property type is Contractor
And Building limit is <building_limit>
And all classification descriptions are Carpentry-Interior-Office
And location modifier factor is <location_mod_factor>
And protection modifier factor is <protection_mod_factor>
When we quote
Then the liability lessor premium is <liab_premium>

Examples:
 |building_limit |location_mod_factor |protection_mod_factor |liab_premium |
 |100000         |0                   |0                     |65           |
 |100000         |0                   |0.02                  |66           |
 |100000         |0.03                |0                     |67           |
 |100000         |0.03                |0.02                  |68           |
 |650000         |0                   |0                     |423          |
 |650000         |0.03                |0                     |436          |
