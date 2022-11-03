import React from 'react'
import '../../../css/Team.css';
import CardView from '../../../components/about/Cards/CardTeam'

// team members import
import member1 from '../../../assets/images/team-members/member1.jpg'


function Team() {
    return (
        <div className='team'>
            <br />
            <div>
                <CardView socialtwitter={'https://twitter.com/Rajat__Rai'} sociallinkdin={'https://www.linkedin.com/in/rajat-rai-96298222b/'} profileimage={member1} profilename={"Rajat Rai"} profilerole={"PHCET"} />
                <CardView socialtwitter={''} sociallinkdin={''} profileimage={member1} profilename={"Shivam Modhave"} profilerole={"PHCET"} />
                <CardView socialtwitter={''} sociallinkdin={''} profileimage={member1} profilename={"Ishika Raikar"} profilerole={"PHCET"} />
                <CardView socialtwitter={''} sociallinkdin={''} profileimage={member1} profilename={"Aman Sharma"} profilerole={"PHCET"} />

            </div>
        </div>
    )

}
export default Team;
