import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type Campus = "Salvador" | "Mosqueda" | "Baterna";
type YearLevel = "1st" | "2nd" | "3rd" | "4th";

interface ProfileData {
  name: string;
  course: string;
  campus: Campus;
  yearLevel: YearLevel;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || "",
    course: "Bachelor of Science in Information Technology",
    campus: "Salvador",
    yearLevel: "1st"
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving profile data:", profileData);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-medium text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">👤 Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">🎓 Course / Program</Label>
                <Input
                  id="course"
                  value={profileData.course}
                  onChange={(e) => setProfileData({ ...profileData, course: e.target.value })}
                  placeholder="Enter your course"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campus">📍 Campus</Label>
                <Select
                  value={profileData.campus}
                  onValueChange={(value: Campus) => setProfileData({ ...profileData, campus: value })}
                >
                  <SelectTrigger id="campus">
                    <SelectValue placeholder="Select campus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salvador">Salvador</SelectItem>
                    <SelectItem value="Mosqueda">Mosqueda</SelectItem>
                    <SelectItem value="Baterna">Baterna</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearLevel">🧑‍🎓 Year Level</Label>
                <Select
                  value={profileData.yearLevel}
                  onValueChange={(value: YearLevel) => setProfileData({ ...profileData, yearLevel: value })}
                >
                  <SelectTrigger id="yearLevel">
                    <SelectValue placeholder="Select year level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Year</SelectItem>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button onClick={handleSave}>
                Save Changes
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 