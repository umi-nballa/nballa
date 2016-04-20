Meta: 
@Jira PC-21858
Scenario: Calculate premium for liability coverage for occupant when the policy has IRPM factors

Given a basic submission with 1 classifications
And each occurence limit is 500000
And product completed ops aggregate limit is 1000000
And general aggregate limit is 1000000
And property type is Contractor
And percentage owner occupied is >10
And all classification descriptions are Carpentry-Interior-Office
And the classification BPP limits are 10000
And all classification has FV limit 5000
And all classification liability exposures are 5000000
And location modifier factor is <location_mod_factor>
And protection modifier factor is <protection_mod_factor>
When we quote
Then the liability occupant premiums are <liab_premiums>

Examples:
 |location_mod_factor |protection_mod_factor |liab_premiums |
 |0                   |0                     |84700         |
 |0                   |0.02                  |86394         |
 |0.03                |0                     |87241         |
 |0.03                |0.02                  |88935         |
