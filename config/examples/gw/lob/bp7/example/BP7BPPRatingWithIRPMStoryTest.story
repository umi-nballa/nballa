Meta: 
@Jira PC-21858
Scenario: Calculate premium for BPP coverage when the policy has IRPM factors

Given a basic submission
And property type is Office
And classification description is Lawyers-Lessor Risk Only
And BPP limit is <bpp_limit>
And location modifier factor is <location_mod_factor>
And protection modifier factor is <protection_mod_factor>
When we quote
Then the BPP premium is <bpp_premium>

Examples:
 |bpp_limit |location_mod_factor |protection_mod_factor |bpp_premium |
 |50000     |0                   |0                     |213         |
 |50000     |0                   |0.02                  |217         |
 |50000     |0.03                |0                     |219         |
 |50000     |0.03                |0.02                  |224         |
 |65000     |0                   |0                     |253         |
 |65000     |0.03                |0                     |261         |
