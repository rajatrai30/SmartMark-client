import React from 'react'
import '../../../css/Team.css';
import CardView from '../../../components/about/Cards/CardTeam'

// team members import
import member1 from '../../../assets/images/team-members/member1.jpg'
import member2 from '../../../assets/images/team-members/member2.png'
import member3 from '../../../assets/images/team-members/member3.png'
import member4 from '../../../assets/images/team-members/member4.png'



function Team() {
    return (
        <div className='team'>
            <br />
            <div>
                <CardView socialtwitter={'https://twitter.com/Rajat__Rai'} sociallinkdin={'https://www.linkedin.com/in/rajat-rai-96298222b/'} profileimage={member1} profilename={"Rajat Rai"} profilerole={"PHCET"} socialgithub={"https://github.com/rajatrai30"}/>
                <CardView socialtwitter={'https://twitter.com/Shivam_Modhave'} sociallinkdin={'https://www.linkedin.com/in/shivam-modhave-142b31220/'} socialgithub={"https://github.com/shxvxm"} profileimage={member2} profilename={"Shivam Modhave"} profilerole={"PHCET"} />
                <CardView socialtwitter={'https://twitter.com/ishika_raikar'} sociallinkdin={'https://www.linkedin.com/in/ishika-raikar/'} socialgithub={"https://github.com/Raikarishika"} profileimage={member3} profilename={"Ishika Raikar"} profilerole={"PHCET"} />
                <CardView socialtwitter={'https://twitter.com/IAman_Sharma'} sociallinkdin={'https://www.linkedin.com/in/aman-sharma-b9a792241/'} socialgithub={"https://github.com/aman212001"} profileimage={member4} profilename={"Aman Sharma"} profilerole={"PHCET"} />

            </div>
        </div>
    )

}
export default Team;
