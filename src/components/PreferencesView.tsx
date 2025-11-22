import { useState, useEffect } from 'react';
import { User, Preferences } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PreferencesViewProps {
  user: User;
}

export function PreferencesView({ user }: PreferencesViewProps) {
  const [preferences, setPreferences] = useState<Preferences>({
    gender: 'Any',
    ageRange: [18, 30],
    sleepSchedule: 'Flexible',
    cleanliness: 'Moderate',
    smoking: false,
    pets: false,
    guests: 'Sometimes',
    budget: [500, 1500],
  });

  useEffect(() => {
    // Mock API call to fetch existing preferences
    // fetch(`/api/users/${user.id}/preferences`)
    //   .then(res => res.json())
    //   .then(data => setPreferences(data));
  }, [user.id]);

  const handleSave = () => {
    // Mock API call - replace with your backend
    // fetch(`/api/users/${user.id}/preferences`, { method: 'PUT', body: JSON.stringify(preferences) })
    
    toast.success('Preferences saved successfully!');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1>Roommate Preferences</h1>
        <p className="text-muted-foreground">
          Set your preferences to find the perfect match
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Preferences</CardTitle>
            <CardDescription>
              General preferences for your ideal roommate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Preferred Gender</Label>
              <Select
                value={preferences.gender}
                onValueChange={(val) =>
                  setPreferences({ ...preferences, gender: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Age Range: {preferences.ageRange[0]} - {preferences.ageRange[1]}
              </Label>
              <Slider
                min={18}
                max={60}
                step={1}
                value={preferences.ageRange}
                onValueChange={(val) =>
                  setPreferences({ ...preferences, ageRange: val as [number, number] })
                }
                className="py-4"
              />
            </div>

            <div className="space-y-2">
              <Label>
                Budget Range: ${preferences.budget[0]} - ${preferences.budget[1]}/month
              </Label>
              <Slider
                min={200}
                max={3000}
                step={50}
                value={preferences.budget}
                onValueChange={(val) =>
                  setPreferences({ ...preferences, budget: val as [number, number] })
                }
                className="py-4"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lifestyle Preferences</CardTitle>
            <CardDescription>
              Daily habits and lifestyle choices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Sleep Schedule</Label>
              <Select
                value={preferences.sleepSchedule}
                onValueChange={(val) =>
                  setPreferences({ ...preferences, sleepSchedule: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Early Bird">Early Bird (Sleep before 10 PM)</SelectItem>
                  <SelectItem value="Normal">Normal (10 PM - 12 AM)</SelectItem>
                  <SelectItem value="Night Owl">Night Owl (After 12 AM)</SelectItem>
                  <SelectItem value="Flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cleanliness Level</Label>
              <Select
                value={preferences.cleanliness}
                onValueChange={(val) =>
                  setPreferences({ ...preferences, cleanliness: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Very Clean">Very Clean</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Relaxed">Relaxed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Guest Policy</Label>
              <Select
                value={preferences.guests}
                onValueChange={(val) =>
                  setPreferences({ ...preferences, guests: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Rarely">Rarely</SelectItem>
                  <SelectItem value="Sometimes">Sometimes</SelectItem>
                  <SelectItem value="Often">Often</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Smoking Acceptable</Label>
                <p className="text-sm text-muted-foreground">
                  Are you okay with a roommate who smokes?
                </p>
              </div>
              <Switch
                checked={preferences.smoking}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, smoking: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pets Acceptable</Label>
                <p className="text-sm text-muted-foreground">
                  Are you okay with a roommate who has pets?
                </p>
              </div>
              <Switch
                checked={preferences.pets}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, pets: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
