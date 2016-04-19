Meta: 
@Jira PC-21858
Scenario: Calculate premium for Building coverage when the policy has IRPM factors

Given a basic submission
And property type is Office
And classification description is Lawyers-Lessor Risk Only
And Building limit is <building_limit>
And location modifier factor is <location_mod_factor>
And protection modifier factor is <protection_mod_factor>
When we quote
Then the Building premium is <building_premium>

Examples:
|building_limit |location_mod_factor |protection_mod_factor |building_premium |
|500000         |0                   |0                     |1180             |
|500000         |0                   |0.02                  |1204             |
|500000         |0.03                |0                     |1215             |
|500000         |0.03                |0.02                  |1239             |
|650000         |0                   |0                     |1372             |
|650000         |0.03                |0                     |1413             |
