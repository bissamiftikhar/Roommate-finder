import { useState, useEffect } from 'react';
import { User, Preferences } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { profileApi } from '../services/api';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const [basicRes, lifestyleRes] = await Promise.all([
        profileApi.getBasicPreferences(),
        profileApi.getLifestylePreferences(),
      ]);

      const basicData = basicRes.data;
      const lifestyleData = lifestyleRes.data;

      // Map backend sleep_schedule to frontend format
      const sleepScheduleMap: { [key: string]: string } = {
        'early_bird': 'Early Bird',
        'normal': 'Normal',
        'night_owl': 'Night Owl',
        'flexible': 'Flexible',
      };

      const guestPolicyMap: { [key: string]: string } = {
        'never': 'Never',
        'rarely': 'Rarely',
        'sometimes': 'Sometimes',
        'often': 'Often',
      };

      const cleanlinessMap: { [key: string]: string } = {
        'very_clean': 'Very Clean',
        'moderate': 'Moderate',
        'relaxed': 'Relaxed',
      };

      setPreferences({
        gender: basicData?.gender_preference === 'any' ? 'Any' : (basicData?.gender_preference?.charAt(0).toUpperCase() + basicData?.gender_preference?.slice(1)) || 'Any',
        ageRange: [basicData?.age_min || 18, basicData?.age_max || 30],
        sleepSchedule: sleepScheduleMap[lifestyleData?.sleep_schedule] || 'Flexible',
        cleanliness: cleanlinessMap[lifestyleData?.cleanliness] || 'Moderate',
        smoking: lifestyleData?.smoking || false,
        pets: lifestyleData?.pets || false,
        guests: guestPolicyMap[lifestyleData?.guest_policy] || 'Sometimes',
        budget: [basicData?.budget_min || 500, basicData?.budget_max || 1500],
      });
    } catch (error) {
      console.error('Failed to load preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Map frontend format to backend format
      const sleepScheduleReverseMap: { [key: string]: string } = {
        'Early Bird': 'early_bird',
        'Normal': 'normal',
        'Night Owl': 'night_owl',
        'Flexible': 'flexible',
      };

      const guestPolicyReverseMap: { [key: string]: string } = {
        'Never': 'never',
        'Rarely': 'rarely',
        'Sometimes': 'sometimes',
        'Often': 'often',
      };

      const cleanlinessReverseMap: { [key: string]: string } = {
        'Very Clean': 'very_clean',
        'Moderate': 'moderate',
        'Relaxed': 'relaxed',
      };

      const basicPreferences = {
        gender_preference: preferences.gender.toLowerCase() === 'any' ? 'any' : preferences.gender.toLowerCase(),
        age_min: preferences.ageRange[0],
        age_max: preferences.ageRange[1],
        budget_min: preferences.budget[0],
        budget_max: preferences.budget[1],
      };

      const lifestylePreferences = {
        sleep_schedule: sleepScheduleReverseMap[preferences.sleepSchedule] || 'flexible',
        cleanliness: cleanlinessReverseMap[preferences.cleanliness] || 'moderate',
        guest_policy: guestPolicyReverseMap[preferences.guests] || 'sometimes',
        smoking: preferences.smoking,
        pets: preferences.pets,
        noise_tolerance: 'moderate',
        study_habits: 'flexible',
      };

      await Promise.all([
        profileApi.updateBasicPreferences(basicPreferences),
        profileApi.updateLifestylePreferences(lifestylePreferences),
      ]);

      toast.success('Preferences saved successfully!');
    } catch (error: any) {
      console.error('Failed to save preferences:', error);
      toast.error(error?.response?.data?.error || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Roommate Preferences
          </h1>
          <p className="text-lg font-semibold text-gray-700 mt-2">
            Set your preferences to find the perfect match
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-white rounded-t-lg border-b border-blue-200">
              <CardTitle className="text-xl font-bold text-gray-800">Basic Preferences</CardTitle>
              <CardDescription className="text-base font-semibold text-gray-600">
                General preferences for your ideal roommate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
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

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-white rounded-t-lg border-b border-purple-200">
            <CardTitle className="text-xl font-bold text-gray-800">Lifestyle Preferences</CardTitle>
            <CardDescription className="text-base font-semibold text-gray-600">
              Daily habits and lifestyle choices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
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

        <Button 
          onClick={handleSave} 
          disabled={saving}
          style={{
            backgroundImage: 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234), rgb(236, 72, 153))',
            color: 'white'
          }}
          className="w-full font-semibold py-6 text-lg shadow-lg transition-all duration-300 rounded-lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Preferences
            </>
          )}
        </Button>
        </div>
      </div>
    </div>
  );
}
