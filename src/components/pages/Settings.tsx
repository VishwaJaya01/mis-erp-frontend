import { useState, useEffect, useMemo } from 'react';
import { AppShell } from '../layout/AppShell';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Switch } from '../ui/switch';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { useRouter } from '../../lib/router';
import {
  useAppearanceTheme,
  useDensity,
  type ThemePreference,
} from '../../lib/appearance';
import { toast } from 'sonner';

export function Settings() {
  const { permissions } = useRouter();
  const { theme: currentTheme, setTheme } = useAppearanceTheme();
  const { density: currentDensity, setDensity } = useDensity();

  // General tab state
  const [theme, setThemeState] = useState('light');
  const [density, setDensityState] = useState<'cozy' | 'compact'>('cozy');
  const handleThemeChange = (value: string) => {
    const nextTheme: ThemePreference =
      value === 'dark' || value === 'system' ? value : 'light';
    setThemeState(nextTheme);
    setTheme(nextTheme);
  };
  const handleDensityChange = (value: string) => {
    const nextDensity = value === 'compact' ? 'compact' : 'cozy';
    setDensityState(nextDensity);
    setDensity(nextDensity);
  };
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('asia_colombo');
  const [weekStart, setWeekStart] = useState('monday');
  const [showInDirectory, setShowInDirectory] = useState(true);
  const [shareStatus, setShareStatus] = useState(true);

  // Work tab state
  const [defaultView, setDefaultView] = useState('my-tasks');
  const [showCompleted, setShowCompleted] = useState(false);
  const [autoStartTimer, setAutoStartTimer] = useState(true);
  const [defaultLogMode, setDefaultLogMode] = useState('timer');
  const [roundDuration, setRoundDuration] = useState('none');
  const [overtimeThreshold, setOvertimeThreshold] = useState('8');
  const [showPendingOnly, setShowPendingOnly] = useState(true);
  const [autoOpenRequest, setAutoOpenRequest] = useState(false);

  // Notifications tab state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [digestEmail, setDigestEmail] = useState('off');
  const [notifOrders, setNotifOrders] = useState({
    quoteSent: true,
    quoteApproved: true,
    movedToProduction: true,
  });
  const [notifTasks, setNotifTasks] = useState({
    assigned: true,
    dueToday: true,
    overdue: true,
  });
  const [notifTime, setNotifTime] = useState({
    submitted: true,
    statusChanged: true,
  });
  const [notifLeave, setNotifLeave] = useState({
    myStatus: true,
    teamRequests: true,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);

        // General settings
        if (settings.general) {
          if (settings.general.theme) setThemeState(settings.general.theme);
          if (settings.general.density)
            setDensityState(
              settings.general.density === 'compact' ? 'compact' : 'cozy'
            );
          if (settings.general.language) setLanguage(settings.general.language);
          if (settings.general.timezone) setTimezone(settings.general.timezone);
          if (settings.general.weekStart)
            setWeekStart(settings.general.weekStart);
          if (settings.general.showInDirectory !== undefined)
            setShowInDirectory(settings.general.showInDirectory);
          if (settings.general.shareStatus !== undefined)
            setShareStatus(settings.general.shareStatus);
        }

        // Work settings
        if (settings.work) {
          if (settings.work.defaultView)
            setDefaultView(settings.work.defaultView);
          if (settings.work.showCompleted !== undefined)
            setShowCompleted(settings.work.showCompleted);
          if (settings.work.autoStartTimer !== undefined)
            setAutoStartTimer(settings.work.autoStartTimer);
          if (settings.work.defaultLogMode)
            setDefaultLogMode(settings.work.defaultLogMode);
          if (settings.work.roundDuration)
            setRoundDuration(settings.work.roundDuration);
          if (settings.work.overtimeThreshold)
            setOvertimeThreshold(settings.work.overtimeThreshold);
          if (settings.work.showPendingOnly !== undefined)
            setShowPendingOnly(settings.work.showPendingOnly);
          if (settings.work.autoOpenRequest !== undefined)
            setAutoOpenRequest(settings.work.autoOpenRequest);
        }

        // Notification settings
        if (settings.notifications) {
          if (settings.notifications.emailNotifications !== undefined)
            setEmailNotifications(settings.notifications.emailNotifications);
          if (settings.notifications.digestEmail)
            setDigestEmail(settings.notifications.digestEmail);
          if (settings.notifications.orders)
            setNotifOrders(settings.notifications.orders);
          if (settings.notifications.tasks)
            setNotifTasks(settings.notifications.tasks);
          if (settings.notifications.time)
            setNotifTime(settings.notifications.time);
          if (settings.notifications.leave)
            setNotifLeave(settings.notifications.leave);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (currentTheme) {
      setThemeState(currentTheme);
    }
  }, [currentTheme]);

  useEffect(() => {
    setDensityState(currentDensity);
  }, [currentDensity]);

  const needsThemeUpdate = useMemo(
    () => currentTheme !== theme,
    [currentTheme, theme]
  );
  const needsDensityUpdate = useMemo(
    () => currentDensity !== density,
    [currentDensity, density]
  );

  const handleSaveGeneral = async () => {
    try {
      const currentSettings = JSON.parse(
        localStorage.getItem('appSettings') || '{}'
      );
      const updatedSettings = {
        ...currentSettings,
        general: {
          theme,
          density,
          language,
          timezone,
          weekStart,
          showInDirectory,
          shareStatus,
        },
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      localStorage.setItem('appSettings', JSON.stringify(updatedSettings));

      if (needsThemeUpdate) {
        setTheme(theme);
      }

      if (needsDensityUpdate) {
        setDensity(density);
      }

      toast.success('General settings saved');
    } catch (error) {
      console.error('Save general settings error:', error);
      toast.error('Failed to save general settings. Please try again.');
    }
  };

  const handleSaveWork = async () => {
    try {
      const currentSettings = JSON.parse(
        localStorage.getItem('appSettings') || '{}'
      );
      const updatedSettings = {
        ...currentSettings,
        work: {
          defaultView,
          showCompleted,
          autoStartTimer,
          defaultLogMode,
          roundDuration,
          overtimeThreshold,
          showPendingOnly,
          autoOpenRequest,
        },
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      toast.success('Work preferences saved');
    } catch (error) {
      console.error('Save work preferences error:', error);
      toast.error('Failed to save work preferences. Please try again.');
    }
  };

  const handleSaveNotifications = async () => {
    try {
      const currentSettings = JSON.parse(
        localStorage.getItem('appSettings') || '{}'
      );
      const updatedSettings = {
        ...currentSettings,
        notifications: {
          emailNotifications,
          digestEmail,
          orders: notifOrders,
          tasks: notifTasks,
          time: notifTime,
          leave: notifLeave,
        },
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      toast.success('Notification preferences saved');
    } catch (error) {
      console.error('Save notification preferences error:', error);
      toast.error('Failed to save notification preferences. Please try again.');
    }
  };

  return (
    <AppShell activePage="settings" breadcrumbs={['Settings']}>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div>
          <h1>Settings</h1>
          <p className="text-muted-foreground mt-1">
            Personal preferences and notifications
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* GENERAL TAB */}
          <TabsContent value="general" className="space-y-6">
            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the app looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <RadioGroup value={theme} onValueChange={handleThemeChange}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="cursor-pointer">
                        Light
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="cursor-pointer">
                        Dark
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="cursor-pointer">
                        System
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Density</Label>
                  <RadioGroup
                    value={density}
                    onValueChange={handleDensityChange}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cozy" id="cozy" />
                      <Label htmlFor="cozy" className="cursor-pointer">
                        Cozy
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="compact" id="compact" />
                      <Label htmlFor="compact" className="cursor-pointer">
                        Compact
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleSaveGeneral}>Save</Button>
                </div>
              </CardContent>
            </Card>

            {/* Localization */}
            <Card>
              <CardHeader>
                <CardTitle>Localization</CardTitle>
                <CardDescription>
                  Language and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="si">Sinhala</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia_colombo">Asia/Colombo</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Week starts on</Label>
                  <RadioGroup value={weekStart} onValueChange={setWeekStart}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monday" id="monday" />
                      <Label htmlFor="monday" className="cursor-pointer">
                        Monday
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sunday" id="sunday" />
                      <Label htmlFor="sunday" className="cursor-pointer">
                        Sunday
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleSaveGeneral}>Save</Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
                <CardDescription>
                  Control your visibility and presence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Team directory search</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow your profile to appear in team directory search
                    </p>
                  </div>
                  <Switch
                    checked={showInDirectory}
                    onCheckedChange={setShowInDirectory}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Online status</Label>
                    <p className="text-sm text-muted-foreground">
                      Share your online status (active/away)
                    </p>
                  </div>
                  <Switch
                    checked={shareStatus}
                    onCheckedChange={setShareStatus}
                  />
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleSaveGeneral}>Save</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* WORK TAB */}
          <TabsContent value="work" className="space-y-6">
            {/* Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  Configure task management preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultView">Default view for Work</Label>
                  <Select value={defaultView} onValueChange={setDefaultView}>
                    <SelectTrigger id="defaultView">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="my-tasks">My Tasks</SelectItem>
                      {permissions.canSeeAllJobs && (
                        <SelectItem value="all-jobs">All Jobs</SelectItem>
                      )}
                      <SelectItem value="time">Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show completed tasks</Label>
                    <p className="text-sm text-muted-foreground">
                      Display completed tasks by default
                    </p>
                  </div>
                  <Switch
                    checked={showCompleted}
                    onCheckedChange={setShowCompleted}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-start timer</Label>
                    <p className="text-sm text-muted-foreground">
                      Start timer when moving task to "In progress"
                    </p>
                  </div>
                  <Switch
                    checked={autoStartTimer}
                    onCheckedChange={setAutoStartTimer}
                  />
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleSaveWork}>Save</Button>
                </div>
              </CardContent>
            </Card>

            {/* Time Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Time Tracking</CardTitle>
                <CardDescription>
                  Manage time logging preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default log mode</Label>
                  <RadioGroup
                    value={defaultLogMode}
                    onValueChange={setDefaultLogMode}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="timer" id="timer" />
                      <Label htmlFor="timer" className="cursor-pointer">
                        Timer
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual" className="cursor-pointer">
                        Manual
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="roundDuration">Round durations to</Label>
                  <Select
                    value={roundDuration}
                    onValueChange={setRoundDuration}
                  >
                    <SelectTrigger id="roundDuration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="overtime">
                    Overtime highlight threshold (hours/day)
                  </Label>
                  <Input
                    id="overtime"
                    type="number"
                    value={overtimeThreshold}
                    onChange={(e) => setOvertimeThreshold(e.target.value)}
                    min="1"
                    max="24"
                  />
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleSaveWork}>Save</Button>
                </div>
              </CardContent>
            </Card>

            {/* Approvals (Supervisor/Manager only) */}
            {permissions.canReviewTime && (
              <Card>
                <CardHeader>
                  <CardTitle>Approvals</CardTitle>
                  <CardDescription>
                    Configure approval workflow preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Time review</Label>
                      <p className="text-sm text-muted-foreground">
                        Show only pending submissions by default
                      </p>
                    </div>
                    <Switch
                      checked={showPendingOnly}
                      onCheckedChange={setShowPendingOnly}
                    />
                  </div>

                  {permissions.canSeeLeaveApprovals && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Leave approvals</Label>
                          <p className="text-sm text-muted-foreground">
                            Auto-open newest request
                          </p>
                        </div>
                        <Switch
                          checked={autoOpenRequest}
                          onCheckedChange={setAutoOpenRequest}
                        />
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="flex justify-end">
                    <Button onClick={handleSaveWork}>Save</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications" className="space-y-6">
            {/* Channels */}
            <Card>
              <CardHeader>
                <CardTitle>Channels</CardTitle>
                <CardDescription>
                  Choose how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>In-app notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Always enabled
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="digest">Digest email</Label>
                  <Select value={digestEmail} onValueChange={setDigestEmail}>
                    <SelectTrigger id="digest">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications}>Save</Button>
                </div>
              </CardContent>
            </Card>

            {/* Events */}
            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
                <CardDescription>
                  Choose which events trigger notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Orders */}
                <div className="space-y-3">
                  <Label>Orders</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="quoteSent"
                        checked={notifOrders.quoteSent}
                        onCheckedChange={(checked) =>
                          setNotifOrders({
                            ...notifOrders,
                            quoteSent: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="quoteSent" className="cursor-pointer">
                        Quote sent
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="quoteApproved"
                        checked={notifOrders.quoteApproved}
                        onCheckedChange={(checked) =>
                          setNotifOrders({
                            ...notifOrders,
                            quoteApproved: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="quoteApproved" className="cursor-pointer">
                        Quote approved
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="movedToProduction"
                        checked={notifOrders.movedToProduction}
                        onCheckedChange={(checked) =>
                          setNotifOrders({
                            ...notifOrders,
                            movedToProduction: checked as boolean,
                          })
                        }
                      />
                      <Label
                        htmlFor="movedToProduction"
                        className="cursor-pointer"
                      >
                        Moved to production
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Tasks */}
                <div className="space-y-3">
                  <Label>Tasks</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="assigned"
                        checked={notifTasks.assigned}
                        onCheckedChange={(checked) =>
                          setNotifTasks({
                            ...notifTasks,
                            assigned: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="assigned" className="cursor-pointer">
                        Assigned to me
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dueToday"
                        checked={notifTasks.dueToday}
                        onCheckedChange={(checked) =>
                          setNotifTasks({
                            ...notifTasks,
                            dueToday: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="dueToday" className="cursor-pointer">
                        Due today
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="overdue"
                        checked={notifTasks.overdue}
                        onCheckedChange={(checked) =>
                          setNotifTasks({
                            ...notifTasks,
                            overdue: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="overdue" className="cursor-pointer">
                        Overdue
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Time */}
                <div className="space-y-3">
                  <Label>Time</Label>
                  <div className="space-y-2">
                    {permissions.canReviewTime && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="submitted"
                          checked={notifTime.submitted}
                          onCheckedChange={(checked) =>
                            setNotifTime({
                              ...notifTime,
                              submitted: checked as boolean,
                            })
                          }
                        />
                        <Label htmlFor="submitted" className="cursor-pointer">
                          Submitted by my team
                        </Label>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="statusChanged"
                        checked={notifTime.statusChanged}
                        onCheckedChange={(checked) =>
                          setNotifTime({
                            ...notifTime,
                            statusChanged: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="statusChanged" className="cursor-pointer">
                        Approved/Rejected (my entries)
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Leave */}
                <div className="space-y-3">
                  <Label>Leave</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="myStatus"
                        checked={notifLeave.myStatus}
                        onCheckedChange={(checked) =>
                          setNotifLeave({
                            ...notifLeave,
                            myStatus: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="myStatus" className="cursor-pointer">
                        My request status changes
                      </Label>
                    </div>
                    {permissions.canSeeLeaveApprovals && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="teamRequests"
                          checked={notifLeave.teamRequests}
                          onCheckedChange={(checked) =>
                            setNotifLeave({
                              ...notifLeave,
                              teamRequests: checked as boolean,
                            })
                          }
                        />
                        <Label
                          htmlFor="teamRequests"
                          className="cursor-pointer"
                        >
                          Team requests pending
                        </Label>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications}>Save</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
