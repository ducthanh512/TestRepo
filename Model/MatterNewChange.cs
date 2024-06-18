using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace odpp_serverless.Model
{
    public class MatterNewChange
    {
        public int ID { get; set; }
        public string? MatterNumber { get; set; }
        public string? MatterName { get; set; }
        public string? MatterSubjects { get; set; }
        public string? MatterHREF { get; set; }
        public string? MatterStatus { get; set; }
        public string? PrimaryChargeCategory { get; set; }
        public string? MatterType { get; set; }
        public string? MatterState { get; set; }
        public string? PracticeWithCarriage { get; set; }
        public string? PracticeWithCarriageEmail { get; set; }
        public string? PracticeWithCarriageManagerHierarchyEmail { get; set; }
        public string? LegalTeams { get; set; }
        public string? LegalTeamEmails { get; set; }
        public string? OthersWithRead { get; set; }
        public string? OthersWithEdit { get; set; }
        public string? BlockUserEmails { get; set; }
        public DateTime? DateEntered { get; set; }
        public string? NewOrChange { get; set; }
        public string? Workgroup { get; set; }
        public string? ODPPOffice { get; set; }
        public string? JusticeLinkCaseNumber { get; set; }
        public string? PoliceEventNumber { get; set; }
        public string? AccessType { get; set; }
    }
}
